import express, { Response } from 'express';
import mongoose from 'mongoose';
import ExcelJS from 'exceljs';
import { Language, Patient, ReservedStep } from '@3dp4me/types';

import { requireAdmin } from '../../middleware/authentication';
import { AuthenticatedRequest } from '../../middleware/types';
import { StepModel } from '../../models/Metadata';
import { PatientModel } from '../../models/Patient';
import errorWrap from '../../utils/errorWrap';
import { sendResponse } from '../../utils/response';
import {
    addSheet,
    buildStepColumns,
    ExportRow,
    getPatientIdentifierColumns,
    getPatientInfoColumns,
    getPatientInfoSheetName,
    StepData,
    toUniqueSheetName,
} from '../../utils/exportUtils';

export const router = express.Router();

const getStepDataByPatientId = async (stepKey: string) => {
    const docs: StepData[] = await mongoose.model(stepKey).find({}).lean();
    return new Map<string, StepData>(docs.map((d) => [d.patientId.toString(), d]));
};

/**
 * Exports all patient data to an Excel workbook. The first sheet holds basic patient info,
 * followed by one sheet per step where each row is a patient.
 */
router.get(
    '/patients',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const lang = (req.query.lang ?? Language.EN) as Language;
        if (!Object.values(Language).includes(lang))
            return sendResponse(res, 400, `Invalid language "${lang}"`);

        const patients: Patient[] = await PatientModel.find({}).lean();
        patients.sort((a, b) => a.orderId.localeCompare(b.orderId, undefined, { numeric: true }));

        const steps = await StepModel.find({
            isDeleted: { $ne: true },
            isHidden: { $ne: true },
        }).sort({ stepNumber: 1 });

        const workbook = new ExcelJS.Workbook();
        const usedSheetNames = new Set<string>();
        const isRightToLeft = lang === Language.AR;

        const toRows = (dataByPatientId: Map<string, StepData>): ExportRow[] =>
            patients.map((patient) => ({
                patient,
                stepData: dataByPatientId.get(patient._id.toString()) ?? null,
            }));

        const stepData = await Promise.all(
            steps.map((step) => getStepDataByPatientId(step.key)),
        );
        const rootIndex = steps.findIndex((s) => s.key === ReservedStep.Root);
        const rootData = stepData[rootIndex] ?? new Map();
        const rootFields = steps[rootIndex]?.fields ?? [];

        addSheet(
            workbook,
            toUniqueSheetName(getPatientInfoSheetName(lang), usedSheetNames),
            [
                ...getPatientInfoColumns(lang),
                ...buildStepColumns(rootFields, [...rootData.values()], lang),
            ],
            toRows(rootData),
            isRightToLeft,
        );

        steps.forEach((step, i) => {
            if (i === rootIndex) return;

            addSheet(
                workbook,
                toUniqueSheetName(step.displayName[lang], usedSheetNames),
                [
                    ...getPatientIdentifierColumns(lang),
                    ...buildStepColumns(step.fields, [...stepData[i].values()], lang),
                ],
                toRows(stepData[i]),
                isRightToLeft,
            );
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        await workbook.xlsx.write(res);
        return res.end();
    }),
);

module.exports = router;
