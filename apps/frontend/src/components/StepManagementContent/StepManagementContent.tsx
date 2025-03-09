import './StepManagementContent.scss'

import {
    Field,
    FieldType,
    Language,
    MaxRecursionDepth,
    PathToField,
    StepPathToField,
} from '@3dp4me/types'

import { useTranslations } from '../../hooks/useTranslations'
import CreateIcon from '@mui/icons-material/Create';
import { getJSONReferenceByStringPath } from '../../utils/utils'
import { FormOption } from '../Fields/FormOption'
import RadioButtonField from '../Fields/RadioButtonField'

export interface StepManagementContentProps {
    onDownPressed: (key: string, root: StepPathToField, index: number) => void
    onUpPressed: (key: string, root: StepPathToField, index: number) => void
    onEditField: (root: StepPathToField, index: number) => void
    onAddSubfield: (key: string, rootKey: StepPathToField) => void
    stepMetadata: Record<string, any>
    isEditing: boolean
    allRoles: FormOption[]
}

const StepManagementContent = ({
    onDownPressed,
    onUpPressed,
    onEditField,
    onAddSubfield,
    stepMetadata,
    isEditing,
    allRoles,
}: StepManagementContentProps) => {
    const selectedLang = useTranslations()[1]
    const formatRoles = (roles: string[]) => {
        if (!roles?.length) return 'Admin'

        // Filters out all roles that aren't in roles
        const filteredRoles = allRoles.filter((role) => roles.indexOf(role._id) >= 0)

        // Concatenates roles into string separated by comma
        const roleString = filteredRoles.reduce(
            (prev, curr) => `${prev}, ${curr.Question?.[selectedLang]}`,
            ''
        )

        // Removes unnecessary comma at the beginning of roleString
        return roleString.substring(2, roleString.length)
    }

    const renderBottomSection = (field: Field) => {
        switch (field?.fieldType) {
            case FieldType.RADIO_BUTTON:
                return (
                    <div className="bottom-container">
                        <RadioButtonField
                            title=""
                            fieldId={field?.key}
                            options={field?.options}
                            isDisabled
                        />
                    </div>
                )
            default:
                return null
        }
    }

    const renderEditButtons = (
        fieldRoot: StepPathToField,
        fieldNumber: number,
        isSubField: boolean
    ) => {
        if (!isEditing) return null

        // Since subfields are rendered from left to right, their buttons will have to change.
        if (isSubField) {
            return (
                <div className="subfield-buttons">
                    <div className="reorder-subfield-buttons">
                        <div
                            onClick={() => onUpPressed(stepMetadata.key, fieldRoot, fieldNumber)}
                            className="up-button"
                        >
                            <i className="chevron left icon" />
                        </div>
                        <div
                            onClick={() => onDownPressed(stepMetadata.key, fieldRoot, fieldNumber)}
                            className="down-button"
                        >
                            <i className="chevron right icon" />
                        </div>
                    </div>
                    <div
                        className="edit-field-button"
                        onClick={() => onEditField(fieldRoot, fieldNumber)}
                    >
                        {/* <i className="pencil alternate icon" /> */}
                        <CreateIcon />
                    </div>
                </div>
            )
        }

        return (
            <div className="field-buttons">
                <div
                    className="edit-field-button"
                    onClick={() => onEditField(fieldRoot, fieldNumber)}
                >
                    {/* <i className="pencil alternate icon" /> */}
                    <CreateIcon />
                </div>

                <div className="reorder-field-buttons">
                    <div
                        onClick={() => onUpPressed(stepMetadata.key, fieldRoot, fieldNumber)}
                        className="up-button"
                    >
                        <i className="chevron up icon" />
                    </div>
                    <div
                        onClick={() => onDownPressed(stepMetadata.key, fieldRoot, fieldNumber)}
                        className="down-button"
                    >
                        <i className="chevron down icon" />
                    </div>
                </div>
            </div>
        )
    }

    function generateAddSubFieldButton(stepKey: string, root: StepPathToField) {
        if (!isEditing) return null
        return (
            <div onClick={() => onAddSubfield(stepKey, root)} className="add-subfield-button">
                <i className="chevron add icon" />
            </div>
        )
    }

    function getPathToSubfields(fieldRoot: StepPathToField, fieldNumber: number): StepPathToField {
        const root: PathToField<
            `fields`,
            MaxRecursionDepth
        > = `${fieldRoot}[${getFieldIndexGivenFieldNumber(fieldRoot, fieldNumber)}].subFields`

        // Have to cheat a little here with the type. Since we can technically recurse forever,
        // we have to force the case to StepPathToField which has a recursion depth 1 less than
        // the type of root
        return root as StepPathToField
    }

    // TODO Handle recurseive case fields[number].subfields
    function generateSubfieldInfo(field: Field, fieldRoot: StepPathToField, fieldNumber: number) {
        if (field.fieldType !== FieldType.FIELD_GROUP) return null

        const root = getPathToSubfields(fieldRoot, fieldNumber)

        return (
            <div className="subfield-container">
                {generateButtonInfo(field.subFields, root, true)}
                {generateAddSubFieldButton(stepMetadata.key, root)}
            </div>
        )
    }

    function getFieldIndexGivenFieldNumber(fieldRoot: string, fieldNumber: number): number {
        return getJSONReferenceByStringPath(stepMetadata, fieldRoot)?.findIndex(
            (field: Field) => field.fieldNumber === fieldNumber
        )
    }

    function getFieldClassName(field: Field) {
        let fieldClassName = field.isHidden ? 'hidden-step-field-container' : 'step-field-container'

        // Handles case when the user has the language set to Arabic
        if (selectedLang === Language.AR) {
            fieldClassName += ' '
            if (isEditing) {
                fieldClassName += 'expanded-arabic-field-container'
            } else {
                fieldClassName += 'retracted-arabic-field-container'
            }
        }

        return fieldClassName
    }

    function generateButtonInfo(fields: Field[], fieldRoot: StepPathToField, isSubField: boolean) {
        if (!fields) return null

        return fields.map((field) => {
            if (field.isDeleted) return null // don't render fields when they are marked as deleted

            return (
                <div className={getFieldClassName(field)}>
                    <div className="content">
                        <div className="info">
                            <div className="header">{field.displayName[selectedLang]}</div>
                            <div className="description">Field Type: {field.fieldType}</div>
                            <div className="description">
                                Readable Roles: {formatRoles(field.readableGroups)}
                            </div>
                            <div className="description">
                                Writable Roles: {formatRoles(field.writableGroups)}
                            </div>

                            {generateSubfieldInfo(field, fieldRoot, field.fieldNumber)}
                        </div>

                        {renderEditButtons(fieldRoot, field.fieldNumber, isSubField)}
                    </div>

                    {renderBottomSection(field)}
                </div>
            )
        })
    }

    return (
        <div className="content-container">
            {generateButtonInfo(stepMetadata?.fields, 'fields', false)}
        </div>
    )
}

export default StepManagementContent
