import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';

import {
    getAllRoles,
    getAllStepsMetadata,
    updateMultipleSteps,
} from '../../api/api';
import BottomBar from '../../components/BottomBar/BottomBar';
import CreateFieldModal from '../../components/CreateFieldModal/CreateFieldModal';
import CreateStepModal from '../../components/CreateStepModal/CreateStepModal';
import EditStepModal from '../../components/EditStepModal/EditStepModal';
import EditFieldModal from '../../components/EditFieldModal/EditFieldModal';
import Sidebar from '../../components/Sidebar/Sidebar';
import StepManagementContent from '../../components/StepManagementContent/StepManagementContent';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import scssVars from '../../styles/variables.scss';
import {
    DIRECTION,
    getValidAdjacentElement,
    swapValuesInArrayByKey,
} from '../../utils/dashboard-utils';
import {
    generateKeyWithoutCollision,
    getStepIndexGivenKey,
    getFieldIndexByNumber,
} from '../../utils/metadataUtils';
import {
    rolesToMultiSelectFormat,
    sortMetadata,
    getJSONReferenceByStringPath,
} from '../../utils/utils';
import './DashboardManagement.scss';

const { drawerWidth, verticalMovementWidth } = scssVars

const expandedSidebarWidth = `${
    parseInt(drawerWidth, 10) + 3 * parseInt(verticalMovementWidth, 10)
}px`;
const retractedSidebarWidth = drawerWidth;

const SectionTab = () => {
    const [stepMetadata, setStepMetadata] = useState([]);
    const [originalStepMetadata, setOriginalStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [createFieldModalOpen, setCreateFieldModalOpen] = useState(false);
    const [editFieldModalOpen, setEditFieldModalOpen] = useState(false);
    const [editStepModalOpen, setEditStepModalOpen] = useState(false);
    const [createStepModalOpen, setCreateStepModalOpen] = useState(false);
    const [allRoles, setAllRoles] = useState([]);
    const [selectedFieldNumberForEditing, setSelectedFieldNumberForEditing] =
        useState(0);
    const [selectedFieldRootForEditing, setSelectedFieldRootForEditing] =
        useState('fields'); // Identifies where to edit a field in stepMetadata
    const [selectedStepNumberForEditing, setSelectedStepNumberForEditing] =
        useState(0);
    const [selectedFieldRootForCreating, setSelectedFieldRootForCreating] =
        useState('fields'); // Identifies where to add a field in stepMetadata
    const [canAddFieldGroup, setCanAddFieldGroup] = useState(true); // Toggled to false if the create field modal is open for creating a subfield

    const errorWrap = useErrorWrap();

    /* Event handlers for when a user wants to create/edit a step/field. The outcome is a modal will open. */

    const onAddStep = () => {
        setCreateStepModalOpen(true);
    };

    const onAddField = (stepKey, fieldRoot) => {
        setSelectedStep(stepKey);
        setSelectedFieldRootForCreating(fieldRoot);
        setCreateFieldModalOpen(true);
        setCanAddFieldGroup(true);
    };

    const onAddSubfield = (stepKey, fieldRoot) => {
        setSelectedStep(stepKey);
        setSelectedFieldRootForCreating(fieldRoot);
        setCreateFieldModalOpen(true);
        setCanAddFieldGroup(false);
    };

    const onEditField = (fieldRoot, fieldNumber) => {
        setSelectedFieldNumberForEditing(fieldNumber);
        setSelectedFieldRootForEditing(fieldRoot);
        setEditFieldModalOpen(true);
    };

    const onEditStep = (stepKey) => {
        setSelectedStepNumberForEditing(stepKey);

        const stepIndex = getStepIndexGivenKey(stepMetadata, stepKey);
        setSelectedStep(stepMetadata[stepIndex].key);
        setEditStepModalOpen(true);
    };

    // Sends a request for updating the database with the modified steps/fields
    const onSaveChanges = () => {
        let updateResponse;

        errorWrap(
            async () => {
                setIsEditing(false);
                updateResponse = await trackPromise(
                    updateMultipleSteps(stepMetadata),
                );
            },
            () => {
                setIsEditing(false);
                setOriginalStepMetadata(updateResponse.result);
                setStepMetadata(updateResponse.result);

                // Update selected
                if (updateResponse.result.length >= 1) {
                    setSelectedStep(updateResponse.result[0].key);
                } else {
                    setSelectedStep('');
                }
            },
            () => {
                // Allow editing when the save fails
                setIsEditing(true);
            },
        );
    };

    // Discards any changes the user made to the fields/steps
    const onDiscardChanges = async () => {
        setStepMetadata(originalStepMetadata);
        setIsEditing(false);
    };

    // Used to update the highlighted step whose fields the user will see
    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    /**
     * Moves a step up or down by changing its stepNumber
     * @param {String} stepKey
     * @param {Number} direction 1 indicates increasing stepNumber, -1 indicates decreasing fieldNumber
     */
    function moveStep(stepKey, direction) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const currStepIndex = getStepIndexGivenKey(updatedMetadata, stepKey);

        if (currStepIndex < 0) return;

        const adjStepIndex = getValidAdjacentElement(
            updatedMetadata,
            currStepIndex,
            direction,
        );

        if (adjStepIndex < 0) return;

        // Perform field number swap
        swapValuesInArrayByKey(
            updatedMetadata,
            'stepNumber',
            currStepIndex,
            adjStepIndex,
        );

        const sortedMetadata = sortMetadata(updatedMetadata);
        setStepMetadata(sortedMetadata);
    }

    // Handles moving a step down
    function onDownPressed(stepKey) {
        moveStep(stepKey, DIRECTION.DOWN);
    }

    // Handles moving a step up
    function onUpPressed(stepKey) {
        moveStep(stepKey, DIRECTION.UP);
    }

    /**
     * Moves a field up or down for a given step's fields
     * @param {String} stepKey Step whose fields will be changed
     * @param {Number} fieldNumber The number of the field that we have to move
     * @param {Number} direction 1 indicates moving down (increasing fieldNumber), -1 indicates moving up (decreasing fieldNumber)
     */
    function moveField(stepKey, fieldNumber, fieldRoot, direction) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const foundStepIndex = getStepIndexGivenKey(updatedMetadata, stepKey);

        if (foundStepIndex < 0) return;

        // Reference to the fields/subfields array we are modifying.
        const fieldsArray = getJSONReferenceByStringPath(
            updatedMetadata[foundStepIndex],
            fieldRoot,
        );

        const currFieldIndex = getFieldIndexByNumber(fieldsArray, fieldNumber);

        const adjFieldIndex = getValidAdjacentElement(
            fieldsArray,
            currFieldIndex,
            direction,
        );

        if (adjFieldIndex < 0) return;

        // Perform field number swap
        swapValuesInArrayByKey(
            fieldsArray,
            'fieldNumber',
            currFieldIndex,
            adjFieldIndex,
        );

        const sortedMetadata = sortMetadata(updatedMetadata);
        setStepMetadata(sortedMetadata);
    }

    // Handles moving a field down
    function onCardDownPressed(stepKey, fieldRoot, fieldNumber) {
        moveField(stepKey, fieldNumber, fieldRoot, DIRECTION.DOWN);
    }

    // Handles moving a field up
    function onCardUpPressed(stepKey, fieldRoot, fieldNumber) {
        moveField(stepKey, fieldNumber, fieldRoot, DIRECTION.UP);
    }

    function GenerateStepManagementContent() {
        const selectedStepMetadata = stepMetadata.find(
            (step) => step.key === selectedStep,
        );
        if (!selectedStepMetadata) return null;

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
        );
    }

    useEffect(() => {
        errorWrap(async () => {
            const fetchData = async () => {
                const res = await trackPromise(getAllStepsMetadata(true)); // true indicates that we want to get hidden field

                const sortedMetadata = sortMetadata(res.result);

                if (sortedMetadata.length > 0) {
                    setSelectedStep(sortedMetadata[0].key);
                }

                setStepMetadata(sortedMetadata);
                setOriginalStepMetadata(sortedMetadata);
            };

            const fetchRoles = async () => {
                const rolesRes = await trackPromise(getAllRoles());
                const roles = rolesToMultiSelectFormat(rolesRes.result);
                setAllRoles(roles);
            };

            await fetchData();
            await fetchRoles();
        });
    }, [setStepMetadata, errorWrap]);

    /* The functions below generate modals for altering fields/steps. */

    const generateNewFieldPopup = () => {
        return (
            <CreateFieldModal
                isOpen={createFieldModalOpen}
                onModalClose={onCreateFieldModalClose}
                allRoles={allRoles}
                onAddNewField={addNewField}
                canAddFieldGroup={canAddFieldGroup}
            />
        );
    };

    const generateEditFieldPopup = () => {
        const stepIndex = getStepIndexGivenKey(stepMetadata, selectedStep);

        if (stepIndex < 0) return null;

        const fieldArrayReference = getJSONReferenceByStringPath(
            stepMetadata[stepIndex],
            selectedFieldRootForEditing,
        );

        if (!fieldArrayReference) return null;

        const fieldIndex = getFieldIndexByNumber(
            fieldArrayReference,
            selectedFieldNumberForEditing,
        );

        if (fieldIndex < 0) return null;

        const fieldData = getJSONReferenceByStringPath(
            stepMetadata[stepIndex],
            selectedFieldRootForEditing,
        )[fieldIndex];

        if (!fieldData) return null;

        return (
            <EditFieldModal
                isOpen={editFieldModalOpen}
                initialData={fieldData}
                onModalClose={onEditFieldModalClose}
                allRoles={allRoles}
                onEditField={editField}
            />
        );
    };

    const generateNewStepPopup = () => {
        return (
            <CreateStepModal
                isOpen={createStepModalOpen}
                onModalClose={() => setCreateStepModalOpen(false)}
                allRoles={allRoles}
                onAddNewStep={addNewStep}
            />
        );
    };

    const generateEditStepPopup = () => {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const stepIndex = getStepIndexGivenKey(
            updatedMetadata,
            selectedStepNumberForEditing,
        );
        const stepData = updatedMetadata[stepIndex];

        if (!stepData) return null;

        return (
            <EditStepModal
                initialData={stepData}
                isOpen={editStepModalOpen}
                onModalClose={() => setEditStepModalOpen(false)}
                allRoles={allRoles}
                onEditStep={editStep}
            />
        );
    };

    const onCreateFieldModalClose = () => {
        setCreateFieldModalOpen(false);
    };

    const onEditFieldModalClose = () => {
        setEditFieldModalOpen(false);
    };

    /*  The functions below perform the action of adding or editing a field/step. 
        The result is stepMetadata will be modified, meaning the changes
        will only be saved locally. 
    */

    const addNewField = (newFieldData) => {
        const updatedNewField = _.cloneDeep(newFieldData);
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const stepIndex = updatedMetadata.findIndex((element) => {
            return element.key === selectedStep;
        });

        if (stepIndex < 0) return;

        const fieldArrayReference = getJSONReferenceByStringPath(
            updatedMetadata[stepIndex],
            selectedFieldRootForCreating,
        );

        // Set the field number to one more than the field number of the
        // last field for the selected step.
        if (fieldArrayReference.length) {
            updatedNewField.fieldNumber =
                fieldArrayReference[fieldArrayReference.length - 1]
                    .fieldNumber + 1;
        } else {
            updatedNewField.fieldNumber = 1;
        }
        // Mark as not being deleted and not hidden
        updatedNewField.isDeleted = false;
        updatedNewField.isHidden = false;
        fieldArrayReference.push(updatedNewField);
        setStepMetadata(updatedMetadata);
    };

    const editStep = (updatedStepData) => {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStep);
        updatedMetadata[stepIndex] = updatedStepData;
        setStepMetadata(updatedMetadata);
    };

    const editField = (updatedFieldData) => {
        const updatedField = _.cloneDeep(updatedFieldData);
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStep);

        if (stepIndex < 0) return;

        const fieldArrayReference = getJSONReferenceByStringPath(
            updatedMetadata[stepIndex],
            selectedFieldRootForEditing,
        );

        if (!fieldArrayReference) return;

        const fieldIndex = getFieldIndexByNumber(
            fieldArrayReference,
            selectedFieldNumberForEditing,
        );

        if (fieldIndex < 0) return;

        fieldArrayReference[fieldIndex] = updatedField;

        setStepMetadata(updatedMetadata);
    };

    const addNewStep = (newStepData) => {
        const updatedNewStep = _.cloneDeep(newStepData);
        const updatedMetadata = _.cloneDeep(stepMetadata);

        // Set the step number to one more than the step number of the
        // last step in updatedMetadata.
        if (updatedMetadata.length) {
            updatedNewStep.stepNumber =
                updatedMetadata[updatedMetadata.length - 1].stepNumber + 1;
        } else {
            // Default step number is 0
            updatedNewStep.stepNumber = 0;
        }

        // Generate a key for this step
        const currentStepKeys = updatedMetadata.map((step) => step.key);
        updatedNewStep.key = generateKeyWithoutCollision(
            updatedNewStep.displayName.EN,
            currentStepKeys,
        );

        // Mark as not being deleted and not hidden
        updatedNewStep.isDeleted = false;
        updatedNewStep.isHidden = false;

        updatedMetadata.push(updatedNewStep);
        setStepMetadata(updatedMetadata);
        setSelectedStep(updatedNewStep.key);
    };

    return (
        <div>
            <div className="dashboard section-management-container">
                <div className="sidebar-container">
                    <Sidebar
                        onClick={UpdateSelectedStep}
                        onDownPressed={onDownPressed}
                        onUpPressed={onUpPressed}
                        onAddStep={onAddStep}
                        onAddField={onAddField}
                        onEditStep={onEditStep}
                        stepMetadata={stepMetadata}
                        onEditSteps={() => setIsEditing(true)}
                        isEditing={isEditing}
                        selectedStep={selectedStep}
                    />
                    <ListItem
                        button
                        onClick={() => {
                            setCreateStepModalOpen(false);
                        }}
                    />
                </div>
                <div className="step-management-content-container">
                    {GenerateStepManagementContent()}
                </div>

                <BottomBar
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onAddField={onAddField}
                    onSave={onSaveChanges}
                    onDiscard={onDiscardChanges}
                    style={{
                        editorSection: {
                            marginLeft: `${
                                isEditing
                                    ? expandedSidebarWidth
                                    : retractedSidebarWidth
                            }`,
                        },
                    }}
                    selectedStep={selectedStep}
                />
            </div>
            {generateNewStepPopup()}
            {generateNewFieldPopup()}
            {generateEditStepPopup()}
            {generateEditFieldPopup()}
        </div>
    );
};

SectionTab.propTypes = {};

export default SectionTab;
