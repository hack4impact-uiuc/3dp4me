import './DashboardManagement.scss'

import { BaseStep, Field, Nullish, Step, StepPathToField, Unsaved } from '@3dp4me/types'
import ListItem from '@mui/material/ListItem'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'

import { ApiResponse, getAllRoles, getAllStepsMetadata, updateMultipleSteps } from '../../api/api'
import BottomBar from '../../components/BottomBar/BottomBar'
import CreateFieldModal, { NewField } from '../../components/CreateFieldModal/CreateFieldModal'
import CreateStepModal from '../../components/CreateStepModal/CreateStepModal'
import EditFieldModal from '../../components/EditFieldModal/EditFieldModal'
import EditStepModal from '../../components/EditStepModal/EditStepModal'
import { FormOption } from '../../components/Fields/FormOption'
import Sidebar from '../../components/Sidebar/Sidebar'
import StepManagementContent from '../../components/StepManagementContent/StepManagementContent'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import {
    Direction,
    getValidAdjacentElement,
    swapValuesInArrayByKey,
} from '../../utils/dashboard-utils'
import {
    generateKeyWithoutCollision,
    getFieldIndexByNumber,
    getStepIndexGivenKey,
} from '../../utils/metadataUtils'
import {
    getJSONReferenceByStringPath,
    rolesToMultiSelectFormat,
    sortMetadata,
} from '../../utils/utils'

const SectionTab = () => {
    const [stepMetadata, setStepMetadata] = useState<Step[]>([])
    const [originalStepMetadata, setOriginalStepMetadata] = useState<Step[]>([])
    const [selectedStep, setSelectedStep] = useState<string>('')
    const [isEditing, setIsEditing] = useState(false)
    const [createFieldModalOpen, setCreateFieldModalOpen] = useState(false)
    const [editFieldModalOpen, setEditFieldModalOpen] = useState(false)
    const [editStepModalOpen, setEditStepModalOpen] = useState(false)
    const [createStepModalOpen, setCreateStepModalOpen] = useState(false)
    const [allRoles, setAllRoles] = useState<FormOption[]>([])
    const [selectedFieldNumberForEditing, setSelectedFieldNumberForEditing] = useState(0)
    const [selectedFieldRootForEditing, setSelectedFieldRootForEditing] =
        useState<StepPathToField>('fields') // Identifies where to edit a field in stepMetadata
    const [selectedStepForEdit, setSelectedStepForEdit] = useState<Nullish<string>>(null)
    const [selectedFieldRootForCreating, setSelectedFieldRootForCreating] =
        useState<StepPathToField>('fields') // Identifies where to add a field in stepMetadata
    const [canAddFieldGroup, setCanAddFieldGroup] = useState(true) // Toggled to false if the create field modal is open for creating a subfield

    const errorWrap = useErrorWrap()

    /* Event handlers for when a user wants to create/edit a step/field. The outcome is a modal will open. */

    const onAddStep = () => {
        setCreateStepModalOpen(true)
    }

    const onAddField = (stepKey: string, fieldRoot: StepPathToField) => {
        setSelectedStep(stepKey)
        setSelectedFieldRootForCreating(fieldRoot)
        setCreateFieldModalOpen(true)
        setCanAddFieldGroup(true)
    }

    const onAddSubfield = (stepKey: string, fieldRoot: StepPathToField) => {
        setSelectedStep(stepKey)
        setSelectedFieldRootForCreating(fieldRoot)
        setCreateFieldModalOpen(true)
        setCanAddFieldGroup(false)
    }

    const onEditField = (fieldRoot: StepPathToField, fieldNumber: number) => {
        setSelectedFieldNumberForEditing(fieldNumber)
        setSelectedFieldRootForEditing(fieldRoot)
        setEditFieldModalOpen(true)
    }

    const onEditStep = (stepKey: string) => {
        setSelectedStepForEdit(stepKey)

        const stepIndex = getStepIndexGivenKey(stepMetadata, stepKey)
        setSelectedStep(stepMetadata[stepIndex].key)
        setEditStepModalOpen(true)
    }

    // Sends a request for updating the database with the modified steps/fields
    const onSaveChanges = () => {
        let updateResponse: ApiResponse<Step[]>

        errorWrap(
            async () => {
                setIsEditing(false)
                updateResponse = await trackPromise(updateMultipleSteps(stepMetadata))
            },
            () => {
                setIsEditing(false)
                setOriginalStepMetadata(updateResponse.result)
                setStepMetadata(updateResponse.result)

                // Update selected
                if (updateResponse.result.length >= 1) {
                    setSelectedStep(updateResponse.result[0].key)
                } else {
                    setSelectedStep('')
                }
            },
            () => {
                // Allow editing when the save fails
                setIsEditing(true)
            }
        )
    }

    // Discards any changes the user made to the fields/steps
    const onDiscardChanges = async () => {
        setStepMetadata(originalStepMetadata)
        setIsEditing(false)
    }

    // Used to update the highlighted step whose fields the user will see
    function UpdateSelectedStep(stepKey: string) {
        setSelectedStep(stepKey)
    }

    /**
     * Moves a step up or down by changing its stepNumber
     * @param {String} stepKey
     * @param {Number} direction 1 indicates increasing stepNumber, -1 indicates decreasing fieldNumber
     */
    function moveStep(stepKey: string, direction: Direction) {
        const updatedMetadata = _.cloneDeep(stepMetadata)

        const currStepIndex = getStepIndexGivenKey(updatedMetadata, stepKey)

        if (currStepIndex < 0) return

        const adjStepIndex = getValidAdjacentElement(updatedMetadata, currStepIndex, direction)

        if (adjStepIndex < 0) return

        // Perform field number swap
        swapValuesInArrayByKey(updatedMetadata, 'stepNumber', currStepIndex, adjStepIndex)

        const sortedMetadata = sortMetadata(updatedMetadata)
        setStepMetadata(sortedMetadata)
    }

    // Handles moving a step down
    function onDownPressed(stepKey: string) {
        moveStep(stepKey, Direction.DOWN)
    }

    // Handles moving a step up
    function onUpPressed(stepKey: string) {
        moveStep(stepKey, Direction.UP)
    }

    /**
     * Moves a field up or down for a given step's fields
     * @param {String} stepKey Step whose fields will be changed
     * @param {Number} fieldNumber The number of the field that we have to move
     * @param {Number} direction 1 indicates moving down (increasing fieldNumber), -1 indicates moving up (decreasing fieldNumber)
     */
    function moveField(
        stepKey: string,
        fieldNumber: number,
        fieldRoot: StepPathToField,
        direction: Direction
    ) {
        const updatedMetadata = _.cloneDeep(stepMetadata)

        const foundStepIndex = getStepIndexGivenKey(updatedMetadata, stepKey)

        if (foundStepIndex < 0) return

        // Reference to the fields/subfields array we are modifying.
        const fieldsArray = getJSONReferenceByStringPath(updatedMetadata[foundStepIndex], fieldRoot)

        if (!fieldsArray) return

        const currFieldIndex = getFieldIndexByNumber(fieldsArray, fieldNumber)
        const adjFieldIndex = getValidAdjacentElement(fieldsArray, currFieldIndex, direction)

        if (adjFieldIndex < 0) return

        // Perform field number swap
        swapValuesInArrayByKey(fieldsArray, 'fieldNumber', currFieldIndex, adjFieldIndex)

        const sortedMetadata = sortMetadata(updatedMetadata)
        setStepMetadata(sortedMetadata)
    }

    // Handles moving a field down
    function onCardDownPressed(stepKey: string, fieldRoot: StepPathToField, fieldNumber: number) {
        moveField(stepKey, fieldNumber, fieldRoot, Direction.DOWN)
    }

    // Handles moving a field up
    function onCardUpPressed(stepKey: string, fieldRoot: StepPathToField, fieldNumber: number) {
        moveField(stepKey, fieldNumber, fieldRoot, Direction.UP)
    }

    function GenerateStepManagementContent() {
        const selectedStepMetadata = stepMetadata.find((step) => step.key === selectedStep)
        if (!selectedStepMetadata) return null

        return (
            <StepManagementContent
                isEditing={isEditing}
                onDownPressed={onCardDownPressed}
                onUpPressed={onCardUpPressed}
                stepMetadata={selectedStepMetadata}
                onEditField={onEditField}
                onAddSubfield={onAddSubfield}
                allRoles={allRoles}
            />
        )
    }

    useEffect(() => {
        errorWrap(async () => {
            const fetchData = async () => {
                const res = await trackPromise(getAllStepsMetadata(true)) // true indicates that we want to get hidden field

                const sortedMetadata = sortMetadata(res.result)

                if (sortedMetadata.length > 0) {
                    setSelectedStep(sortedMetadata[0].key)
                }

                setStepMetadata(sortedMetadata)
                setOriginalStepMetadata(sortedMetadata)
            }

            const fetchRoles = async () => {
                const rolesRes = await trackPromise(getAllRoles())
                const roles = rolesToMultiSelectFormat(rolesRes.result)
                setAllRoles(roles)
            }

            await fetchData()
            await fetchRoles()
        })
    }, [setStepMetadata, errorWrap])

    /* The functions below generate modals for altering fields/steps. */

    const generateNewFieldPopup = () => (
        <CreateFieldModal
            isOpen={createFieldModalOpen}
            onModalClose={onCreateFieldModalClose}
            allRoles={allRoles}
            onAddNewField={addNewField}
            canAddFieldGroup={canAddFieldGroup}
        />
    )

    const generateEditFieldPopup = () => {
        const stepIndex = getStepIndexGivenKey(stepMetadata, selectedStep)

        if (stepIndex < 0) return null

        const fieldArrayReference = getJSONReferenceByStringPath(
            stepMetadata[stepIndex],
            selectedFieldRootForEditing
        )

        if (!fieldArrayReference) return null

        const fieldIndex = getFieldIndexByNumber(fieldArrayReference, selectedFieldNumberForEditing)

        if (fieldIndex < 0) return null

        const fieldData = getJSONReferenceByStringPath(
            stepMetadata[stepIndex],
            selectedFieldRootForEditing
        )?.[fieldIndex]

        if (!fieldData) return null

        return (
            <EditFieldModal
                isOpen={editFieldModalOpen}
                initialData={fieldData}
                onModalClose={onEditFieldModalClose}
                allRoles={allRoles}
                onEditField={editField}
            />
        )
    }

    const generateNewStepPopup = () => (
        <CreateStepModal
            isOpen={createStepModalOpen}
            onModalClose={() => setCreateStepModalOpen(false)}
            allRoles={allRoles}
            onAddNewStep={addNewStep}
        />
    )

    const generateEditStepPopup = () => {
        if (!selectedStepForEdit) return null

        const updatedMetadata = _.cloneDeep(stepMetadata)
        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStepForEdit)
        const stepData = updatedMetadata[stepIndex]
        if (!stepData) return null

        return (
            <EditStepModal
                initialData={stepData}
                isOpen={editStepModalOpen}
                onModalClose={() => setEditStepModalOpen(false)}
                allRoles={allRoles}
                onEditStep={editStep}
            />
        )
    }

    const onCreateFieldModalClose = () => {
        setCreateFieldModalOpen(false)
    }

    const onEditFieldModalClose = () => {
        setEditFieldModalOpen(false)
    }

    /*  The functions below perform the action of adding or editing a field/step. 
        The result is stepMetadata will be modified, meaning the changes
        will only be saved locally. 
    */
    const addNewField = async (newFieldData: NewField) => {
        const updatedMetadata = _.cloneDeep(stepMetadata)

        const stepIndex = updatedMetadata.findIndex((element) => element.key === selectedStep)

        if (stepIndex < 0) return

        const fieldArrayReference = getJSONReferenceByStringPath(
            updatedMetadata[stepIndex],
            selectedFieldRootForCreating
        )

        // Set the field number to one more than the field number of the
        // last field for the selected step.
        let fieldNumber = 1
        if (fieldArrayReference?.length) {
            fieldNumber = fieldArrayReference[fieldArrayReference.length - 1].fieldNumber + 1
        }

        // Mark as not being deleted and not hidden
        // const newField: UnsavedField = {
        const newField = {
            isDeleted: false,
            isHidden: false,
            ...newFieldData,
            fieldNumber,
        }

        // TODO: Need to type this
        fieldArrayReference?.push(newField as any)
        setStepMetadata(updatedMetadata)
    }

    const editStep = (updatedStepData: Step) => {
        const updatedMetadata = _.cloneDeep(stepMetadata)
        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStep)
        updatedMetadata[stepIndex] = updatedStepData
        setStepMetadata(updatedMetadata)
    }

    const editField = (updatedFieldData: Unsaved<Field>) => {
        const updatedField = _.cloneDeep(updatedFieldData)
        const updatedMetadata = _.cloneDeep(stepMetadata)

        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStep)

        if (stepIndex < 0) return

        const fieldArrayReference = getJSONReferenceByStringPath(
            updatedMetadata[stepIndex],
            selectedFieldRootForEditing
        )

        if (!fieldArrayReference) return

        const fieldIndex = getFieldIndexByNumber(fieldArrayReference, selectedFieldNumberForEditing)

        if (fieldIndex < 0) return

        // TODO: Type all this as unsaved
        fieldArrayReference[fieldIndex] = updatedField as any

        setStepMetadata(updatedMetadata)
    }

    const addNewStep = (newStepData: BaseStep) => {
        const updatedMetadata = _.cloneDeep(stepMetadata)

        // Set the step number to one more than the step number of the
        // last step in updatedMetadata.
        let stepNumber = 0
        if (updatedMetadata.length) {
            stepNumber = updatedMetadata[updatedMetadata.length - 1].stepNumber + 1
        }

        // Generate a key for this step
        const currentStepKeys = updatedMetadata.map((step) => step.key)
        const key = generateKeyWithoutCollision(newStepData.displayName.EN, currentStepKeys)

        const newFullStep: Step = {
            ...newStepData,
            stepNumber,
            key,
            isDeleted: false,
            isHidden: false,
            defaultToListView: false,
        }

        // TODO: Use setState mutator
        updatedMetadata.push(newFullStep)
        setStepMetadata(updatedMetadata)
        setSelectedStep(newFullStep.key)
    }

    return (
        <div>
            <div className="dashboard section-management-container">
                <div className="sidebar-container">
                    <Sidebar
                        onClick={UpdateSelectedStep}
                        onDownPressed={onDownPressed}
                        onUpPressed={onUpPressed}
                        onAddStep={onAddStep}
                        onEditStep={onEditStep}
                        stepMetadata={stepMetadata}
                        isEditing={isEditing}
                        selectedStep={selectedStep}
                    />
                    <ListItem
                        onClick={() => {
                            setCreateStepModalOpen(false)
                        }}
                    />
                </div>
                <div className="step-management-content-container">
                    {GenerateStepManagementContent()}
                </div>

                <BottomBar
                    shouldShowStatus={false}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onAddField={onAddField}
                    onSave={onSaveChanges}
                    onDiscard={onDiscardChanges}
                    selectedStep={selectedStep}
                />
            </div>
            {generateNewStepPopup()}
            {generateNewFieldPopup()}
            {generateEditStepPopup()}
            {generateEditFieldPopup()}
        </div>
    )
}

export default SectionTab
