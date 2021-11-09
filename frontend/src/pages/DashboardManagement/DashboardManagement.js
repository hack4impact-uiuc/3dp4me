import './DashboardManagement.scss';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';

import BottomBar from '../../components/BottomBar/BottomBar';
import {
    getAllStepsMetadata,
    getAllRoles,
    updateMultipleSteps,
} from '../../api/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import StepManagementContent from '../../components/StepManagementContent/StepManagementContent';
import CreateFieldModal from '../../components/CreateFieldModal/CreateFieldModal';
import EditFieldModal from '../../components/EditFieldModal/EditFieldModal';
import CreateStepModal from '../../components/CreateStepModal/CreateStepModal';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    drawerWidth,
    verticalMovementWidth,
} from '../../styles/variables.scss';
import { sortMetadata, rolesToMultiSelectFormat } from '../../utils/utils';

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
    const [stepModalOpen, setStepModalOpen] = useState(false);
    const [allRoles, setAllRoles] = useState([]);
    const [selectedField, setSelectedField] = useState(0);

    const errorWrap = useErrorWrap();

    const onAddStep = () => {
        setStepModalOpen(true);
    };

    const onAddField = (stepKey) => {
        setSelectedStep(stepKey);
        setCreateFieldModalOpen(true);
    };

    const onEditField = (stepKey, fieldRoot, fieldNumber) => {
        setSelectedField(fieldNumber);
        setEditFieldModalOpen(true);
    };

    const onSaveChanges = () => {
        let updateResponse;

        errorWrap(
            async () => {
                updateResponse = await updateMultipleSteps(stepMetadata);
            },
            () => {
                setIsEditing(false);
                setOriginalStepMetadata(updateResponse.result);
                setStepMetadata(updateResponse.result);
            },
            () => {
                // Allow editing when the save fails
                setIsEditing(true);
            },
        );
    };

    const onDiscardChanges = async () => {
        setStepMetadata(originalStepMetadata);
        setIsEditing(false);
    };

    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    function onDownPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const currStepIndex = updatedMetadata.findIndex((step) => {
            return step.key === stepKey;
        });

        if (currStepIndex >= 0 && currStepIndex < updatedMetadata.length - 1) {
            const tempStepNumber = updatedMetadata[currStepIndex].stepNumber;
            updatedMetadata[currStepIndex].stepNumber =
                updatedMetadata[currStepIndex + 1].stepNumber;
            updatedMetadata[currStepIndex + 1].stepNumber = tempStepNumber;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onUpPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const currStepIndex = updatedMetadata.findIndex((step) => {
            return step.key === stepKey;
        });

        if (currStepIndex > 0 && currStepIndex < updatedMetadata.length) {
            const tempStepNumber = updatedMetadata[currStepIndex].stepNumber;
            updatedMetadata[currStepIndex].stepNumber =
                updatedMetadata[currStepIndex - 1].stepNumber;
            updatedMetadata[currStepIndex - 1].stepNumber = tempStepNumber;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    // Inclusive min and exclusive max
    function checkBounds(min, max, num) {
        return num >= min && num < max;
    }

    // Returns the field before or after a given field based on index
    function getPrevNextField(fields, currIndex, change) {
        let prevNextIndex = currIndex + change;

        while (
            checkBounds(0, fields.length, prevNextIndex) &&
            fields[prevNextIndex].isDeleted
        ) {
            prevNextIndex += change;
        }

        if (prevNextIndex === -1 || prevNextIndex === fields.length) {
            return null;
        }

        return prevNextIndex;
    }

    function onCardDownPressed(stepKey, fieldRoot, fieldNumber) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );

        const currFieldIndex = foundStep.fields.findIndex((field) => {
            return field.fieldNumber === fieldNumber;
        });

        const prevFieldIndex = getPrevNextField(
            foundStep.fields,
            currFieldIndex,
            1,
        );

        if (prevFieldIndex == null) {
            return;
        }

        const tempFieldNumber = foundStep.fields[currFieldIndex].fieldNumber;
        foundStep.fields[currFieldIndex].fieldNumber =
            foundStep.fields[prevFieldIndex].fieldNumber;
        foundStep.fields[prevFieldIndex].fieldNumber = tempFieldNumber;
        const sortedMetadata = sortMetadata(updatedMetadata);
        setStepMetadata(sortedMetadata);
    }

    function onCardUpPressed(stepKey, fieldRoot, fieldNumber) {
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );

        const currFieldIndex = foundStep.fields.findIndex((field) => {
            return field.fieldNumber === fieldNumber;
        });

        const prevFieldIndex = getPrevNextField(
            foundStep.fields,
            currFieldIndex,
            -1,
        );

        if (prevFieldIndex === null) {
            return;
        }

        const tempFieldNumber = foundStep.fields[currFieldIndex].fieldNumber;
        foundStep.fields[currFieldIndex].fieldNumber =
            foundStep.fields[prevFieldIndex].fieldNumber;
        foundStep.fields[prevFieldIndex].fieldNumber = tempFieldNumber;
        const sortedMetadata = sortMetadata(updatedMetadata);
        setStepMetadata(sortedMetadata);
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
                allRoles={allRoles}
            />
        );
    }

    useEffect(() => {
        errorWrap(async () => {
            const fetchData = async () => {
                const res = await getAllStepsMetadata(true); // true indicates that we want to get hidden field

                const sortedMetadata = sortMetadata(res.result);

                if (sortedMetadata.length > 0) {
                    setSelectedStep(sortedMetadata[0].key);
                }

                setStepMetadata(sortedMetadata);
                setOriginalStepMetadata(sortedMetadata);
            };

            const fetchRoles = async () => {
                const rolesRes = await getAllRoles();
                const roles = rolesToMultiSelectFormat(rolesRes.result);
                setAllRoles(roles);
            };

            await fetchData();
            await fetchRoles();
        });
    }, [setStepMetadata, errorWrap]);

    const onCreateFieldModalClose = () => {
        setCreateFieldModalOpen(false);
    };

    const onEditFieldModalClose = () => {
        setEditFieldModalOpen(false);
    };

    const onStepModalClose = () => {
        setStepModalOpen(false);
    };

    const generateNewFieldPopup = () => {
        return (
            <CreateFieldModal
                isOpen={createFieldModalOpen}
                onModalClose={onCreateFieldModalClose}
                allRoles={allRoles}
                onAddNewField={addNewField}
            />
        );
    };

    // Returns the index for a step given its key
    const getStepIndexGivenKey = (stepData, key) => {
        if (!stepData) return -1;
        return stepData.findIndex((step) => step.key === key);
    };

    // This function is needed because the field number doesn't correspond to the index of a field in
    // the fields array. There can be fields with field numbers 1, 2, 4, 5, but no 3, in the fields array.
    const getFieldIndexByNumber = (step, fieldNumber) => {
        if (!step) return -1;
        return step.fields.findIndex(
            (field) => field.fieldNumber === fieldNumber,
        );
    };

    const generateEditFieldPopup = () => {
        const stepIndex = getStepIndexGivenKey(stepMetadata, selectedStep);

        if (stepIndex < 0) return null;

        const fieldIndex = getFieldIndexByNumber(
            stepMetadata[stepIndex],
            selectedField,
        );

        if (fieldIndex < 0) return null;

        const fieldData = stepMetadata[stepIndex].fields[fieldIndex];

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
                isOpen={stepModalOpen}
                onModalClose={onStepModalClose}
            />
        );
    };

    const addNewField = (newFieldData) => {
        const updatedNewField = _.cloneDeep(newFieldData);
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const stepIndex = stepMetadata.findIndex((element) => {
            return element.key === selectedStep;
        });

        updatedNewField.fieldNumber = updatedMetadata[stepIndex].fields.length;
        updatedNewField.isDeleted = false;
        updatedNewField.isHidden = false;
        updatedMetadata[stepIndex].fields.push(updatedNewField);
        setStepMetadata(updatedMetadata);
    };

    const editField = (updatedFieldData) => {
        const updatedField = _.cloneDeep(updatedFieldData);
        const updatedMetadata = _.cloneDeep(stepMetadata);

        const stepIndex = getStepIndexGivenKey(updatedMetadata, selectedStep);

        if (stepIndex < 0) return;

        const fieldIndex = getFieldIndexByNumber(
            updatedMetadata[stepIndex],
            selectedField,
        );

        if (fieldIndex < 0) return;

        updatedMetadata[stepIndex].fields[fieldIndex] = updatedField;

        setStepMetadata(updatedMetadata);
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
                        stepMetadata={stepMetadata}
                        onEditSteps={() => setIsEditing(true)}
                        isEditing={isEditing}
                        selectedStep={selectedStep}
                    />
                    <ListItem
                        button
                        onClick={() => {
                            setStepModalOpen(true);
                        }}
                    />
                </div>
                <div className="step-management-content-container">
                    {GenerateStepManagementContent()}
                </div>

                <BottomBar
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
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
                />
            </div>

            {generateNewStepPopup()}
            {generateNewFieldPopup()}
            {generateEditFieldPopup()}
        </div>
    );
};

SectionTab.propTypes = {};

export default SectionTab;
