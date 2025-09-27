/*
 * Combined Export Script - Steps 1, 2, and 3
 * STEP 1: Generate CSV of all basic patient info
 * STEP 2: Generate CSV of all steps with string-convertible data: String, MultilineString, 
 * Number, Date, Phone, RadioButton, MultiSelect, Tags
 * STEP 3: Export media files (File, Audio, Photo, Signature) from S3 to local filesystem (functions related to S3 are in awsS3Helpers.ts)
 * STEP 4: Package everything into a ZIP file
 * 
 * String CSV excludes: Header, Divider, File, Audio, Photo, Signature, Map
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';
import { initDB } from '../src/utils/initDb';
import { PatientModel } from '../src/models/Patient';
import { StepModel } from '../src/models/Metadata';
// import { FieldType } from '@3dp4me/types';
import { downloadFile, fileExistsInS3, downloadAndSaveFileWithTypeDetection, sanitizeFilename } from '../src/utils/aws/awsS3Helpers';
import archiver from 'archiver';
import { fileTypeFromBuffer } from 'file-type'; 
// Update the import to include Field
import { Field, FieldType } from '@3dp4me/types';
// mongoose.set('strictQuery', false); (for deprecation)

const EXPORT_DIR = path.join(__dirname, 'step_exports');
const MEDIA_EXPORT_DIR = path.join(__dirname, 'patients');
const ZIP_OUTPUT_DIR = path.join(__dirname, 'exports');

const INCLUDED_TYPES = [
  FieldType.STRING,
  FieldType.MULTILINE_STRING,
  FieldType.NUMBER,
  FieldType.DATE,
  FieldType.PHONE,
  FieldType.RADIO_BUTTON,
  FieldType.MULTI_SELECT,
  FieldType.TAGS,
  FieldType.MAP,
];

const IGNORED_FIELD_TYPES = [
  FieldType.FILE,
  FieldType.AUDIO,
  FieldType.PHOTO,
  FieldType.SIGNATURE,
  FieldType.DIVIDER,
  FieldType.HEADER,
];

const MEDIA_FIELD_TYPES = [
  FieldType.FILE,
  FieldType.AUDIO,
  FieldType.PHOTO,
  // FieldType.SIGNATURE, (not media, stored as an array of points on a canvas in mongo. generate an image of this signature and save it)
];

// What to export?
interface ExportOptions {
  includeDeleted?: boolean;
  includeHidden?: boolean;
  zipFilename?: string;
}

async function createZipArchive(zipFilename: string): Promise<string> {
  console.log('\n=== STEP 4: Creating ZIP Archive ===');
  
  if (!fs.existsSync(ZIP_OUTPUT_DIR)) {
    fs.mkdirSync(ZIP_OUTPUT_DIR, { recursive: true });
  }
  
  const zipPath = path.join(ZIP_OUTPUT_DIR, zipFilename);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`ZIP archive created: ${zipPath}`);
      console.log(`Archive size: ${sizeInMB} MB`);
      resolve(zipPath);
    });
    
    // Good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        // Log warning for missing files but don't fail
        console.warn('Archive warning - file not found:', err.message);
      } else {
        // Reject promise for other types of warnings as they indicate real issues
        console.error('Archive warning (treating as error):', err);
        reject(err);
      }
    });
    
    archive.on('error', (err) => {
      console.error('Error creating ZIP archive:', err);
      reject(err);
    });
    
    archive.pipe(output);
    
    // Add patients.csv if it exists
    const patientsCsvPath = path.join(__dirname, 'patients.csv');
    if (fs.existsSync(patientsCsvPath)) {
      archive.file(patientsCsvPath, { name: 'patients.csv' });
      console.log('Added patients.csv to archive');
    }
    
    // Add step CSV files if directory exists
    if (fs.existsSync(EXPORT_DIR)) {
      archive.directory(EXPORT_DIR, 'step_csvs');
      console.log('Added step CSV files to archive');
    }
    
    // Add media files if directory exists
    if (fs.existsSync(MEDIA_EXPORT_DIR)) {
      archive.directory(MEDIA_EXPORT_DIR, 'patients');
      console.log('Added media files to archive');
    }
    
    archive.finalize();
  });
}

// STEP 1: Generate patient CSV (makes patients.csv)
async function generatePatientCSV() {
  console.log('\n=== STEP 1: Generating Patient CSV ===');
  
  const patients = await PatientModel.find();
  const patientRecords = patients.map(p => {
    const obj = p.toObject();

    return {
      ...obj,
      dateCreated: obj.dateCreated?.toISOString(),
      lastEdited: obj.lastEdited?.toISOString(),
    };
  });
  
  const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, 'patients.csv'),
    header: [
      { id: 'dateCreated', title: 'Date Created' },
      { id: 'orderId', title: 'Order ID' },
      { id: 'lastEdited', title: 'Last Edited' },
      { id: 'lastEditedBy', title: 'Last Edited By' },
      { id: 'status', title: 'Status' },
      { id: 'phoneNumber', title: 'Phone Number' },
      { id: 'orderYear', title: 'Order Year' },
      { id: 'firstName', title: 'First Name' },
      { id: 'fathersName', title: 'Father\'s Name' },
      { id: 'grandfathersName', title: 'Grandfather\'s Name' },
      { id: 'familyName', title: 'Family Name' },
    ]
  });

  await csvWriter.writeRecords(patientRecords);
  console.log(`Generated patients.csv with ${patientRecords.length} records`);
}

// STEP 2: Generate step CSVs (makes step_csvs/*.csv)
// Helper function to get filtered step definitions (moved to global scope)
async function getSteps(options: ExportOptions): Promise<any[]> {
  const { includeDeleted = false, includeHidden = false } = options;
  
  // Build query filter based on options
  const stepFilter: any = {};
  if (!includeDeleted) {
    stepFilter.isDeleted = { $ne: true };
  }
  if (!includeHidden) {
    stepFilter.isHidden = { $ne: true };
  }

  // Get step definitions based on filter
  const stepDefinitions = await StepModel.find(stepFilter).lean();
  console.log(`Found ${stepDefinitions.length} step definitions`);
  
  return stepDefinitions;
}

async function generateStepCSVs(options: ExportOptions = {}) {
  const { includeDeleted = false, includeHidden = false } = options;  // default not include hidden or deleted, can be changed
  
  console.log('\n=== STEP 2: Generating Step CSVs ===');
  console.log(`Options: includeDeleted=${includeDeleted}, includeHidden=${includeHidden}`);
  
  if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);

  // Get step definitions using the global getSteps function
  const stepDefinitions = await getSteps(options);

  const patients = await PatientModel.find().lean();
  console.log(`Found ${patients.length} patients`);

  for (const stepDef of stepDefinitions) {
    const stepKey = stepDef.key;
    console.log(`Processing step: ${stepKey}`);
    
    // Get the mongoose model for this step
    let StepDataModel;
    try {
      StepDataModel = mongoose.model(stepKey);
    } catch (error) {
      console.log(`No model found for step ${stepKey}, skipping`);
      continue;
    }

    // Check if this step has field groups
    const hasFieldGroups = stepDef.fields.some((field: any) => 
      field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)
    );

    if (hasFieldGroups) {
      // Process steps with field groups - create individual CSVs per patient
      console.log(`Step ${stepKey} has field groups, creating individual CSVs per patient`);
      
      for (const patient of patients) {
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        if (!stepDoc) continue;

        const patientDir = path.join(EXPORT_DIR, patient.orderId);
        if (!fs.existsSync(patientDir)) fs.mkdirSync(patientDir, { recursive: true });

        const records = [];

        // Get field group data (stored as arrays in the document)
        const fieldGroupData = new Map<string, any[]>();
        
        // Collect all field group arrays
        for (const field of stepDef.fields) {
          if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
            const groupData = stepDoc[field.key];
            if (Array.isArray(groupData)) {
              fieldGroupData.set(field.key, groupData);
            }
          }
        }

        // Find the maximum number of entries across all field groups for this patient
        const maxEntries = Math.max(...Array.from(fieldGroupData.values()).map(arr => arr.length), 0);

        // Create a record for each entry in the field groups
        for (let i = 0; i < maxEntries; i++) {
          const row: Record<string, any> = {
            entryNumber: i + 1,
          };

          // Process each field in the step definition
          for (const field of stepDef.fields) {
            // Skip hidden or deleted fields if not including them
            if (!includeHidden && field.isHidden) continue;
            if (!includeDeleted && field.isDeleted) continue;
            
            if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

            if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
              // Handle field groups (nested fields)
              const groupData = fieldGroupData.get(field.key);
              if (groupData && groupData[i]) {
                for (const subField of field.subFields) {
                  // Skip hidden or deleted subfields if not including them
                  if (!includeHidden && subField.isHidden) continue;
                  if (!includeDeleted && subField.isDeleted) continue;
                  
                  if (INCLUDED_TYPES.includes(subField.fieldType)) {
                    row[subField.key] = formatField(groupData[i][subField.key], subField, 'EN');
                  }
                }
              }
            } else if (INCLUDED_TYPES.includes(field.fieldType)) {
              // Handle regular fields (non-field-group fields)
              row[field.key] = formatField(stepDoc[field.key], field, 'EN');
            }
          }

          records.push(row);
        }

        if (records.length > 0) {
          // Create a mapping of field keys to their display names
          const fieldDisplayNames = new Map<string, string>();
          // Add entry number display name
          fieldDisplayNames.set('entryNumber', 'Entry Number');
          
          // Map field keys to display names from step definition
          for (const field of stepDef.fields) {
            if (!includeHidden && field.isHidden) continue;
            if (!includeDeleted && field.isDeleted) continue;
            if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;
        
            if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
              for (const subField of field.subFields) {
                if (!includeHidden && subField.isHidden) continue;
                if (!includeDeleted && subField.isDeleted) continue;
                if (INCLUDED_TYPES.includes(subField.fieldType)) {
                  fieldDisplayNames.set(subField.key, subField.displayName?.EN || subField.key);
                }
              }
            } else if (INCLUDED_TYPES.includes(field.fieldType)) {
              fieldDisplayNames.set(field.key, field.displayName?.EN || field.key);
            }
          }

          const csvWriter = createObjectCsvWriter({
            path: path.join(patientDir, `${stepKey}.csv`),
            header: Object.keys(records[0]).map(key => ({ 
              id: key, 
              title: fieldDisplayNames.get(key) || key 
            })),
          });

          await csvWriter.writeRecords(records);
          console.log(`Wrote ${records.length} records to ${patientDir}/${stepKey}.csv`);
        }
      }
    } else {
      // Process steps without field groups - maintain original behavior (one CSV per step)
      console.log(`Step ${stepKey} has no field groups, creating single CSV for all patients`);
      
      const records = [];

      for (const patient of patients) {
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        if (!stepDoc) continue;

        const row: Record<string, any> = {
          patientId: patient.orderId,
        };

        // Process each field in the step definition
        for (const field of stepDef.fields) {
          // Skip hidden or deleted fields if not including them
          if (!includeHidden && field.isHidden) continue;
          if (!includeDeleted && field.isDeleted) continue;
          
          if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

          if (INCLUDED_TYPES.includes(field.fieldType)) {
            // Handle regular fields (no field groups in this step)
            row[field.key] = formatField(stepDoc[field.key], field, 'EN');
          }
        }

        records.push(row);
      }

      if (records.length > 0) {
        // Create a mapping of field keys to their display names
        const fieldDisplayNames = new Map<string, string>();
        // Add patient ID display name
        fieldDisplayNames.set('patientId', 'Patient ID');
        
        // Map field keys to display names from step definition
        for (const field of stepDef.fields) {
          if (!includeHidden && field.isHidden) continue;
          if (!includeDeleted && field.isDeleted) continue;
          if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;
      
          if (INCLUDED_TYPES.includes(field.fieldType)) {
            fieldDisplayNames.set(field.key, field.displayName?.EN || field.key);
          }
        }

        const csvWriter = createObjectCsvWriter({
          path: path.join(EXPORT_DIR, `${stepKey}.csv`),
          header: Object.keys(records[0]).map(key => ({ 
            id: key, 
            title: fieldDisplayNames.get(key) || key 
          })),
        });

        await csvWriter.writeRecords(records);
        console.log(`Wrote ${records.length} records to ${stepKey}.csv`);
      } else {
        console.log(`No records found for step ${stepKey}, skip`);
      }
    }
  }
}

// STEP 3: Export media files (makes patients/*/*.jpg)
async function exportStepMedia(options: ExportOptions = {}) {
  const { includeDeleted = false, includeHidden = false } = options;
  
  console.log('\n=== STEP 3: Exporting Media Files ===');
  console.log(`Options: includeDeleted=${includeDeleted}, includeHidden=${includeHidden}`);

  if (!fs.existsSync(MEDIA_EXPORT_DIR)) fs.mkdirSync(MEDIA_EXPORT_DIR);

  const stepDefinitions = await getSteps(options);

  const patients = await PatientModel.find();
  console.log(`Found ${patients.length} patients`);

  let totalFilesDownloaded = 0;

  for (const stepDef of stepDefinitions) {
    const stepKey = stepDef.key;
    console.log(`Processing step: ${stepKey}`);
    
    // Get the mongoose model for this step
    let StepDataModel;
    try {
      StepDataModel = mongoose.model(stepKey);
    } catch (error) {
      console.log(`No model found for step ${stepKey}, skip`);
      continue;
    }

    for (const patient of patients) {
      const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
      if (!stepDoc) continue;

      const patientDir = path.join(MEDIA_EXPORT_DIR, patient.orderId);
      const stepDir = path.join(patientDir, stepKey);
      
      // Track if we actually downloaded any files for this step
      let hasDownloadedFiles = false;

      // Process regular fields
      for (const field of stepDef.fields) {
        // Check if field should be included based on options
        if (!includeHidden && field.isHidden) continue;
        if (!includeDeleted && field.isDeleted) continue;
        
        if (MEDIA_FIELD_TYPES.includes(field.fieldType)) {
          const fileData = stepDoc[field.key];
          if (Array.isArray(fileData)) {
            // Handle array of files
            for (const file of fileData) {
              if (file && file.filename) {
                const s3Key = `${patient._id}/${stepKey}/${field.key}/${file.filename}`;
                const fileExists = await fileExistsInS3(s3Key);
                
                if (fileExists) {
                  // Create directory only when we have actual files
                  if (!hasDownloadedFiles) {
                    fs.mkdirSync(patientDir, { recursive: true });
                    fs.mkdirSync(stepDir, { recursive: true });
                    hasDownloadedFiles = true;
                  }
                  
                  const sanitizedFilename = sanitizeFilename(file.filename);
                  const localPath = path.join(stepDir, sanitizedFilename);
                  const success = await downloadAndSaveFileWithTypeDetection(s3Key, localPath, file.filename);
                  
                  if (success) {
                    console.log(`Downloaded: ${localPath}`);
                    totalFilesDownloaded++;
                  }
                }
              }
            }
          } else if (fileData && fileData.filename) {
            // Handle single file
            const result = await downloadSingleFile(
              patient,
              stepKey,
              field.key,
              fileData,
              patientDir,
              stepDir,
              hasDownloadedFiles
            );
            
            if (result.success) {
              totalFilesDownloaded++;
            }
            hasDownloadedFiles = result.hasDownloadedFiles;
          }
        }
        
      }
    }
  }
  
  console.log(`Media export completed. Downloaded ${totalFilesDownloaded} files.`);
}

// Function to format field values based on type
function formatField(value: any, field: Field, lang: 'EN' | 'AR' = 'EN'): any {
  if (!value) return '';
  
  const fieldType = field.fieldType;
  
  if (fieldType === FieldType.DATE) return new Date(value).toISOString();
  
  if (fieldType === FieldType.MULTI_SELECT || fieldType === FieldType.TAGS || fieldType === FieldType.RADIO_BUTTON) {
    // Handle array values (MULTI_SELECT, TAGS)
    if (Array.isArray(value)) {
      const resolvedValues = value.map(val => resolveFieldOption(field, val, lang)).filter(Boolean);
      return resolvedValues.join(', ');
    }
    // RADIO_BUTTON: single ID
    return resolveFieldOption(field, value, lang) || value;
  }
  
  if (fieldType === FieldType.MAP) {
    // Format MAP data as "lat,lng"
    if (value && typeof value === 'object') {
      const lat = value.lat || value.latitude;
      const lng = value.lng || value.longitude;
      if (lat !== undefined && lng !== undefined) {
        return `${lat},${lng}`;
      }
    }
    return value; 
  }
  
  return value;
}

// Helper function to resolve field option IDs to human-readable text
function resolveFieldOption(field: Field, value: any, lang: 'EN' | 'AR' = 'EN'): string | null {
  if (!field.options || !Array.isArray(field.options) || !value) {
    return null;
  }
  
  // Find the option that matches the value (ID)
  const valStr = value.toString();
  const matchingOption = field.options.find(opt => opt._id?.toString() === valStr);

  if (matchingOption?.Question?.[lang]) {
    return matchingOption.Question[lang];
  }
  
  return null;
}

async function downloadSingleFile(
  patient: any,
  stepKey: string,
  fieldKey: string,
  fileData: any,
  patientDir: string,
  stepDir: string,
  hasDownloadedFiles: boolean
): Promise<{ success: boolean; hasDownloadedFiles: boolean }> {
  if (!fileData || !fileData.filename) {
    return { success: false, hasDownloadedFiles };
  }

  const s3Key = `${patient._id}/${stepKey}/${fieldKey}/${fileData.filename}`;
  const fileExists = await fileExistsInS3(s3Key);
  
  if (!fileExists) {
    return { success: false, hasDownloadedFiles };
  }

  // Create directory only when we have actual files
  if (!hasDownloadedFiles) {
    fs.mkdirSync(patientDir, { recursive: true });
    fs.mkdirSync(stepDir, { recursive: true });
    hasDownloadedFiles = true;
  }
  
  const sanitizedFilename = sanitizeFilename(fileData.filename);
  const localPath = path.join(stepDir, sanitizedFilename);
  const downloadSuccess = await downloadAndSaveFileWithTypeDetection(s3Key, localPath, fileData.filename);
  
  if (downloadSuccess) {
    console.log(`Downloaded: ${localPath}`);
  }
  
  return { success: downloadSuccess, hasDownloadedFiles };
}

// Combined export function - now returns a ReadableStream
export async function runCombinedExport(options: ExportOptions = {}, shouldDisconnect = false) {
  const {
    includeDeleted = false,
    includeHidden = false,
    zipFilename = `3dp4me_export_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.zip`
  } = options;

  await initDB();
  console.log('Connected to DB');
  console.log('Export Configuration:', { includeDeleted, includeHidden, zipFilename });

  try {
    // Generate CSV data in memory
    await generatePatientCSV();
    await generateStepCSVs({ includeDeleted, includeHidden });
    await exportStepMedia({ includeDeleted, includeHidden });

    // Create zip stream instead of file
    const zipStream = await createZipStream();

    console.log('\nExport stream created successfully');
    
    return zipStream;
  } catch (error) {
    console.error('Error during export process:', error);
    throw error;
  } finally {
    if (shouldDisconnect) {
      await mongoose.disconnect();
      console.log('Disconnected from DB');
    }
  }
}

// New function to create a zip stream instead of a file
async function createZipStream(): Promise<NodeJS.ReadableStream> {
  console.log('\n=== STEP 4: Creating ZIP Stream ===');
  
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });
  
  // Handle archiver events
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('Archive warning - file not found:', err.message);
    } else {
      console.error('Archive warning (treating as error):', err);
      throw err;
    }
  });
  
  archive.on('error', (err) => {
    console.error('Error creating ZIP archive:', err);
    throw err;
  });
  
  // Add patients.csv if it exists
  const patientsCsvPath = path.join(__dirname, 'patients.csv');
  if (fs.existsSync(patientsCsvPath)) {
    archive.file(patientsCsvPath, { name: 'patients.csv' });
    console.log('Added patients.csv to archive');
  }
  
  // Add step CSV files if directory exists
  if (fs.existsSync(EXPORT_DIR)) {
    archive.directory(EXPORT_DIR, 'step_csvs');
    console.log('Added step CSV files to archive');
  }
  
  // Add media files if directory exists
  if (fs.existsSync(MEDIA_EXPORT_DIR)) {
    archive.directory(MEDIA_EXPORT_DIR, 'patients');
    console.log('Added media files to archive');
  }
  
  // Finalize the archive
  archive.finalize();
  
  return archive;
}

// Main function for command line usage
async function main() {
  const includeDeleted = process.argv.includes('--include-deleted');
  const includeHidden = process.argv.includes('--include-hidden');

  const zipFilenameArg = process.argv.find(arg => arg.startsWith('--zip-filename='));
  const customZipFilename = zipFilenameArg ? zipFilenameArg.split('=')[1] : undefined;

  await runCombinedExport({
    includeDeleted,
    includeHidden,
    zipFilename: customZipFilename
  }, true);
}



// Replace the detectFileTypeFromBuffer function
async function detectFileTypeFromBuffer(buffer: Buffer): Promise<string | null> {
  try {
    const result = await fileTypeFromBuffer(buffer);
    return result?.ext || null;
  } catch (error) {
    console.error('Error detecting file type:', error);  // defaults to .png
    return null;
  }
}

// Function to add the proper extension to a filename, default to .png if no type is detected
function addProperExtension(originalFilename: string, detectedType: string | null): string {
  // If file already has an extension, keep it
  const hasExtension = path.extname(originalFilename).length > 0;
  if (hasExtension) {
    return originalFilename;
  }

  // If we detected a type, add the extension
  if (detectedType) {
    return `${originalFilename}.${detectedType}`;
  }

  // Default fallback - most files are images
  return `${originalFilename}.png`;
}


// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('Error in main function:', err);
    process.exit(1);
  });
}