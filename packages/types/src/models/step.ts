import { Nullish, Path, PathValue, Unsaved } from "src/utils"
import { Field, UnsavedField } from "./field"
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


export type BaseStep = Omit<Step, "key"|"stepNumber"| "defaultToListView"|"isHidden"|"isDeleted">
export type UnsavedStep = Omit<Step, "fields"> & { fields: UnsavedField[] }