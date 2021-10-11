import './DashboardManagement.scss';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';

import BottomBar from '../../components/BottomBar/BottomBar';
import { getAllStepsMetadata, getAllRoles } from '../../api/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import StepManagementContent from '../../components/StepManagementContent/StepManagementContent';
import CreateFieldModal from '../../components/CreateFieldModal/CreateFieldModal';
import CreateStepModal from '../../components/CreateStepModal/CreateStepModal';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    drawerWidth,
    verticalMovementWidth,
} from '../../styles/variables.scss';
import { resolveMixedObjPath } from '../../utils/object';
import { useTranslations } from '../../hooks/useTranslations';
import { sortMetadata , rolesToMultiSelectFormat } from '../../utils/utils';

const expandedSidebarWidth = `${
    parseInt(drawerWidth, 10) + 3 * parseInt(verticalMovementWidth, 10)
}px`;
const retractedSidebarWidth = drawerWidth;

const SectionTab = () => {
    const translations = useTranslations()[0];
    const [stepMetadata, setStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [fieldModalOpen, setFieldModalOpen] = useState(false);
    const [stepModalOpen, setStepModalOpen] = useState(false);
    const [allRoles, setAllRoles] = useState([]);

    const errorWrap = useErrorWrap();

    const onAddStep = () => {
        setStepModalOpen(true);
    };

    const onAddField = () => {
        setFieldModalOpen(true);
    };

    const onEditField = () => {
        // setFieldModalOpen(true);
        // TODO
    };

    const onSaveChanges = () => {
        // TODO: Send changes to backend
        setIsEditing(false);
    };

    const onDiscardChanges = () => {
        // TODO: Delete changes here
        setIsEditing(false);
    };

    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    function onDownPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundField = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const afterField = updatedMetadata.find(
            (field) => field.stepNumber === foundField.stepNumber + 1,
        );
        if (foundField.stepNumber !== updatedMetadata.length - 1) {
            foundField.stepNumber++;
            afterField.stepNumber--;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onCardDownPressed(stepKey, fieldRoot, fieldNumber) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const root = resolveMixedObjPath(foundStep, fieldRoot);
        const foundField = root.find((f) => f.fieldNumber === fieldNumber);
        const afterField = root.find((f) => f.fieldNumber === fieldNumber + 1);

        if (foundField && afterField) {
            foundField.fieldNumber++;
            afterField.fieldNumber--;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onUpPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundField = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const beforeField = updatedMetadata.find(
            (field) => field.stepNumber === foundField.stepNumber - 1,
        );

        if (foundField && beforeField) {
            foundField.stepNumber--;
            beforeField.stepNumber++;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onCardUpPressed(stepKey, fieldRoot, fieldNumber) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const root = resolveMixedObjPath(foundStep, fieldRoot);
        const foundField = root.find((f) => f.fieldNumber === fieldNumber);
        const beforeField = root.find((f) => f.fieldNumber === fieldNumber - 1);
        if (foundField.fieldNumber !== 0) {
            foundField.fieldNumber--;
            beforeField.fieldNumber++;
            const sortedMetadata = sortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
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
            />
        );
    }

    useEffect(() => {
        errorWrap(async () => {
            const fetchData = async () => {
                const res = await getAllStepsMetadata();
                if (res.result.length > 0) {
                    setSelectedStep(res.result[0].key);
                }
                const sortedMetadata = sortMetadata(res.result);
                setStepMetadata(sortedMetadata);
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

    const onFieldModalClose = () => {
        setFieldModalOpen(false);
    };

    const onStepModalClose = () => {
        setStepModalOpen(false);
    };

    const generateNewFieldPopup = () => {
        return (
            <CreateFieldModal
                isOpen={fieldModalOpen}
                onModalClose={onFieldModalClose}
                allRoles={allRoles}
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
                    >
                        {translations.components.file.addAnother}
                    </ListItem>
                </div>
                <div className="step-management-content-container">
                    {GenerateStepManagementContent()}
                </div>

                <BottomBar
                    eisEditing={isEditing}
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
        </div>
    );
};

SectionTab.propTypes = {};

export default SectionTab;
