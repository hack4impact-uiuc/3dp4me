import './SectionTab.scss';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';
import Sidebar from '../Sidebar/Sidebar';
import StepManagementContent from '../StepManagementContent/StepManagementContent';
import CreateFieldModal from '../CreateFieldModal/CreateFieldModal';
import CreateSectionModal from '../CreateSectionModal/CreateSectionModal';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];
    const [stepMetadata, setStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');
    const [isEditingSteps, setIsEditingSteps] = useState(false);
    const [fieldModalOpen, setFieldModalOpen] = useState(false);
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const errorWrap = useErrorWrap();
    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    function SortMetadata(stepMetaData) {
        const data = stepMetaData.sort((a, b) => a.stepNumber - b.stepNumber);
        data.forEach((stepData) => {
            stepData.fields.sort((a, b) => a.fieldNumber - b.fieldNumber);
        });
        return data;
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
            foundField.stepNumber += 1;
            afterField.stepNumber -= 1;
            const sortedMetadata = SortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onCardDownPressed(stepKey, fieldKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const foundField = foundStep.fields.find(
            (field) => field.key === fieldKey,
        );
        const afterField = foundStep.fields.find(
            (field) => field.fieldNumber === foundField.fieldNumber + 1,
        );
        if (foundField.fieldNumber !== updatedMetadata.length - 1) {
            foundField.fieldNumber += 1;
            afterField.fieldNumber -= 1;
            const sortedMetadata = SortMetadata(updatedMetadata);
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
        if (foundField.stepNumber !== 0) {
            foundField.stepNumber -= 1;
            beforeField.stepNumber += 1;
            const sortedMetadata = SortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
        }
    }

    function onCardUpPressed(stepKey, fieldKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundStep = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const foundField = foundStep.fields.find(
            (field) => field.key === fieldKey,
        );
        const beforeField = foundStep.fields.find(
            (field) => field.fieldNumber === foundField.fieldNumber - 1,
        );
        if (foundField.fieldNumber !== 0) {
            foundField.fieldNumber -= 1;
            beforeField.fieldNumber += 1;
            const sortedMetadata = SortMetadata(updatedMetadata);
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
                languageData={languageData}
                fields={selectedStepMetadata.fields}
                onDownPressed={onCardDownPressed}
                onUpPressed={onCardUpPressed}
                stepMetadata={selectedStepMetadata}
            />
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            errorWrap(async () => {
                const res = await getAllStepsMetadata();
                if (res.result.length > 0) {
                    setSelectedStep(res.result[0].key);
                }
                const sortedMetadata = SortMetadata(res.result);
                setStepMetadata(sortedMetadata);
            });
        };
        fetchData();
    }, [setStepMetadata, errorWrap]);

    const onFieldModalClose = () => {
        setFieldModalOpen(false);
    };

    const onSectionModalClose = () => {
        setSectionModalOpen(false);
    };

    const generateNewFieldPopup = () => {
        return (
            <CreateFieldModal
                isOpen={fieldModalOpen}
                onModalClose={onFieldModalClose}
                languageData={languageData}
            />
        );
    };

    const generateNewSectionPopup = () => {
        return (
            <CreateSectionModal
                isOpen={sectionModalOpen}
                onModalClose={onSectionModalClose}
                languageData={languageData}
            />
        );
    };

    return (
        <div>
            <div className="dashboard section-management-container">
                <div className="sidebar-container">
                    <Sidebar
                        languageData={languageData}
                        onClick={UpdateSelectedStep}
                        onDownPressed={onDownPressed}
                        onUpPressed={onUpPressed}
                        stepMetadata={stepMetadata}
                        onEditSteps={() => setIsEditingSteps(true)}
                        isEditing={isEditingSteps}
                    />
                    <ListItem
                        button
                        onClick={() => {
                            setSectionModalOpen(true);
                        }}
                    >
                        {lang.components.file.addAnother}
                    </ListItem>
                    {generateNewSectionPopup()}
                </div>
                <div className="step-management-content-container">
                    {GenerateStepManagementContent()}
                </div>
            </div>
        </div>
    );
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
