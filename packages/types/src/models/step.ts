import { Field } from "./field"
import { TranslatedString } from "./translatedString"

export enum StepStatus {
    UNFINISHED = 'Unfinished',
    PARTIAL = 'Partial',
    FINISHED = 'Finished',
};

export interface Step {
    key: string,
    displayName: TranslatedString,
    stepNumber: number,
    readableGroups: string[],
    writableGroups: string[],
    defaultToListView: boolean,
    fields: Field[]
    isHidden: boolean,
    isDeleted: boolean
}