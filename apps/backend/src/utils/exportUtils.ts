import {
    Field,
    FieldType,
    Language,
    MapPoint,
    Patient,
    PatientStatus,
    QuestionOption,
    TranslatedString,
} from '@3dp4me/types'
import ExcelJS from 'exceljs'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StepData = Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */

export type CellValue = string | number | Date | null

export interface ExportRow {
    patient: Patient
    stepData: StepData | null
}

export interface ExportColumn<T> {
    header: string
    getValue: (row: T) => CellValue
}

const NON_EXPORTABLE_FIELD_TYPES = [
    FieldType.FILE,
    FieldType.PHOTO,
    FieldType.AUDIO,
    FieldType.SIGNATURE,
    FieldType.HEADER,
    FieldType.DIVIDER,
]

const MAX_SHEET_NAME_LENGTH = 31

const HEADERS: Record<string, TranslatedString> = {
    orderId: { EN: 'Order ID', AR: 'رقم الطلب' },
    firstName: { EN: 'First Name', AR: 'الاسم الأول' },
    fathersName: { EN: "Father's Name", AR: 'اسم الأب' },
    grandfathersName: { EN: "Grandfather's Name", AR: 'اسم الجد' },
    familyName: { EN: 'Family Name', AR: 'اسم العائلة' },
    phoneNumber: { EN: 'Phone Number', AR: 'رقم الهاتف' },
    status: { EN: 'Status', AR: 'الحالة' },
    dateCreated: { EN: 'Date Created', AR: 'تاريخ الإنشاء' },
    lastEdited: { EN: 'Last Edited', AR: 'التعديل الأخير' },
    lastEditedBy: { EN: 'Last Edited By', AR: 'آخر تعديل بواسطة' },
    patientInfoSheet: { EN: 'Patient Info', AR: 'معلومات المريض' },
}

const PATIENT_STATUS_TRANSLATIONS: Record<PatientStatus, TranslatedString> = {
    [PatientStatus.ACTIVE]: { EN: 'Active', AR: 'نشط' },
    [PatientStatus.ARCHIVED]: { EN: 'Archived', AR: 'الأرشيف' },
    [PatientStatus.FEEDBACK]: { EN: 'Feedback', AR: 'التغذية المرتدة' },
    [PatientStatus.WAITLIST]: { EN: 'Waitlist', AR: 'قائمة الانتظار' },
}

export const isExportableField = (field: Field) =>
    !field.isDeleted && !field.isHidden && !NON_EXPORTABLE_FIELD_TYPES.includes(field.fieldType)

const getOptionLabel = (options: QuestionOption[], id: unknown, lang: Language) =>
    options.find((o) => o._id.toString() === id?.toString())?.Question[lang] ?? null

const decodeValue = (field: Field, value: unknown, lang: Language): CellValue => {
    if (value === undefined || value === null || value === '') return null

    switch (field.fieldType) {
        case FieldType.STRING:
        case FieldType.MULTILINE_STRING:
        case FieldType.PHONE:
            return String(value)
        case FieldType.NUMBER:
            return Number(value)
        case FieldType.DATE:
            return new Date(value as Date)
        case FieldType.RADIO_BUTTON:
        case FieldType.DROPDOWN:
            return getOptionLabel(field.options, value, lang)
        case FieldType.TAGS: {
            const labels = (value as string[])
                .map((id) => getOptionLabel(field.options, id, lang))
                .filter((l) => l !== null)
            return labels.length ? labels.join(', ') : null
        }
        case FieldType.MAP: {
            const { latitude, longitude } = value as MapPoint
            if (latitude === undefined || longitude === undefined) return null
            return `${latitude},${longitude}`
        }
        default:
            return null
    }
}

/**
 * Builds the columns for a list of fields. Field groups are expanded into one set of columns
 * per entry, sized to the patient with the most entries.
 */
export const buildFieldColumns = (
    fields: Field[],
    allStepData: StepData[],
    lang: Language
): ExportColumn<StepData | null>[] => {
    const sortedFields = fields
        .filter(isExportableField)
        .sort((a, b) => a.fieldNumber - b.fieldNumber)

    return sortedFields.flatMap((field) => {
        const header = field.displayName[lang]

        if (field.fieldType !== FieldType.FIELD_GROUP) {
            return [
                {
                    header,
                    getValue: (data: StepData | null) =>
                        decodeValue(field, data?.[field.key], lang),
                },
            ]
        }

        const groups: StepData[][] = allStepData.map((d) => d?.[field.key] ?? [])
        const numEntries = Math.max(0, ...groups.map((g) => g.length))

        return Array.from({ length: numEntries }, (_, i) => {
            const entries = groups.map((g) => g[i]).filter(Boolean)
            return buildFieldColumns(field.subFields, entries, lang).map((subColumn) => ({
                header: `${header} ${i + 1} - ${subColumn.header}`,
                getValue: (data: StepData | null) =>
                    subColumn.getValue(data?.[field.key]?.[i] ?? null),
            }))
        }).flat()
    })
}

export const buildStepColumns = (
    fields: Field[],
    allStepData: StepData[],
    lang: Language
): ExportColumn<ExportRow>[] =>
    buildFieldColumns(fields, allStepData, lang).map((c) => ({
        header: c.header,
        getValue: (row) => c.getValue(row.stepData),
    }))

export const getPatientIdentifierColumns = (lang: Language): ExportColumn<ExportRow>[] => [
    { header: HEADERS.orderId[lang], getValue: ({ patient: p }) => p.orderId },
    { header: HEADERS.firstName[lang], getValue: ({ patient: p }) => p.firstName ?? null },
    { header: HEADERS.familyName[lang], getValue: ({ patient: p }) => p.familyName ?? null },
]

export const getPatientInfoColumns = (lang: Language): ExportColumn<ExportRow>[] => [
    { header: HEADERS.orderId[lang], getValue: ({ patient: p }) => p.orderId },
    { header: HEADERS.firstName[lang], getValue: ({ patient: p }) => p.firstName ?? null },
    { header: HEADERS.fathersName[lang], getValue: ({ patient: p }) => p.fathersName ?? null },
    {
        header: HEADERS.grandfathersName[lang],
        getValue: ({ patient: p }) => p.grandfathersName ?? null,
    },
    { header: HEADERS.familyName[lang], getValue: ({ patient: p }) => p.familyName ?? null },
    { header: HEADERS.phoneNumber[lang], getValue: ({ patient: p }) => p.phoneNumber ?? null },
    {
        header: HEADERS.status[lang],
        getValue: ({ patient: p }) =>
            PATIENT_STATUS_TRANSLATIONS[p.status]?.[lang] ?? p.status ?? null,
    },
    { header: HEADERS.dateCreated[lang], getValue: ({ patient: p }) => p.dateCreated ?? null },
    { header: HEADERS.lastEdited[lang], getValue: ({ patient: p }) => p.lastEdited ?? null },
    { header: HEADERS.lastEditedBy[lang], getValue: ({ patient: p }) => p.lastEditedBy ?? null },
]

export const getPatientInfoSheetName = (lang: Language) => HEADERS.patientInfoSheet[lang]

/**
 * Makes a name valid for an Excel sheet and unique among usedNames. Excel disallows []:*?/\,
 * names over 31 characters, and duplicate names (case-insensitive).
 */
export const toUniqueSheetName = (name: string, usedNames: Set<string>) => {
    const base =
        name
            .replace(/[[\]:*?/\\]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/^'+|'+$/g, '')
            .trim() || 'Sheet'

    let candidate = base.slice(0, MAX_SHEET_NAME_LENGTH)
    for (let i = 2; usedNames.has(candidate.toLowerCase()); i++) {
        const suffix = ` (${i})`
        candidate = base.slice(0, MAX_SHEET_NAME_LENGTH - suffix.length) + suffix
    }

    usedNames.add(candidate.toLowerCase())
    return candidate
}

const autosizeColumns = (sheet: ExcelJS.Worksheet) => {
    sheet.columns.forEach((column) => {
        let maxLength = 10
        column.eachCell?.({ includeEmpty: false }, (cell) => {
            const length = cell.value instanceof Date ? 20 : String(cell.value ?? '').length
            maxLength = Math.max(maxLength, length)
        })
        // eslint-disable-next-line no-param-reassign
        column.width = Math.min(maxLength + 2, 60)
    })
}

export const addSheet = (
    workbook: ExcelJS.Workbook,
    name: string,
    columns: ExportColumn<ExportRow>[],
    rows: ExportRow[],
    isRightToLeft: boolean
) => {
    const sheet = workbook.addWorksheet(name, {
        views: [{ state: 'frozen', ySplit: 1, rightToLeft: isRightToLeft }],
    })

    sheet.addRow(columns.map((c) => c.header)).font = { bold: true }
    rows.forEach((row) => {
        const sheetRow = sheet.addRow(columns.map((c) => c.getValue(row)))
        sheetRow.eachCell((cell) => {
            // eslint-disable-next-line no-param-reassign
            if (cell.value instanceof Date) cell.numFmt = 'yyyy-mm-dd hh:mm'
        })
    })

    autosizeColumns(sheet)
}
