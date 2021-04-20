import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';
import Sidebar from '../Sidebar/Sidebar';
import StepManagementContent from '../StepManagementContent/StepManagementContent';
import CreateFieldModal from '../CreateFieldModal/CreateFieldModal';
import _ from 'lodash';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const errorWrap = useErrorWrap();
    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    function onDownPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        console.log(updatedMetadata);
        const foundField = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const afterField = updatedMetadata.find(
            (field) => field.stepNumber === foundField.stepNumber + 1,
        );
        if (foundField.stepNumber != updatedMetadata.length - 1) {
            foundField.stepNumber++;
            afterField.stepNumber--;
            const sortedMetadata = SortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
            console.log(updatedMetadata);
        }
    }

    function onCardDownPressed(stepKey) {
        const updatedMetadata = _.cloneDeep(stepMetadata);
        console.log(updatedMetadata);
        const foundField = updatedMetadata.find(
            (field) => field.fields.key === stepKey,
        );
        console.log(foundField);
        /*const afterField = updatedMetadata.find( (fields) => fields.fieldNumber === foundField.fieldNumber + 1);
        if (foundField.fieldNumber != updatedMetadata.length - 1) {
            foundField.fieldNumber++;
            afterField.fieldNumber--;
            const sortedMetadata = SortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
            console.log(updatedMetadata);
        }*/
    }

    function onUpPressed(stepKey) {
        console.log(stepKey);
        const updatedMetadata = _.cloneDeep(stepMetadata);
        const foundField = updatedMetadata.find(
            (field) => field.key === stepKey,
        );
        const beforeField = updatedMetadata.find(
            (field) => field.stepNumber === foundField.stepNumber - 1,
        );
        if (foundField.stepNumber != 0) {
            foundField.stepNumber--;
            beforeField.stepNumber++;
            const sortedMetadata = SortMetadata(updatedMetadata);
            setStepMetadata(sortedMetadata);
            console.log(updatedMetadata);
        }
    }

    function GenerateStepManagementContent() {
        return stepMetadata.map((element) => {
            if (selectedStep !== element.key) {
                return null;
            }
            return (
                <StepManagementContent
                    languageData={languageData}
                    fields={element.fields}
                    onDownPressed={onCardDownPressed}
                    onUpPressed={onDownPressed}
                />
            );
        });
    }

    function SortMetadata(stepMetaData) {
        stepMetaData = stepMetaData.sort((a, b) => a.stepNumber - b.stepNumber);
        stepMetaData.forEach((stepData) => {
            stepData.fields = stepData.fields.sort(
                (a, b) => a.fieldNumber - b.fieldNumber,
            );
        });
        return stepMetaData;
    }

    useEffect(() => {
        const fetchData = async () => {
            errorWrap(async () => {
                const res = await getAllStepsMetadata();

                if (res != null) {
                    setStepMetadata(res.result);
                }
                if (res.result > 1) {
                    setSelectedStep(res[0].key);
                }
                if (!res?.success || !res?.result) return;

                const sortedMetadata = SortMetadata(res.result);
                setStepMetadata(sortedMetadata);
            });
        };
        fetchData();
    }, [setStepMetadata, errorWrap]);

    /*const generateSteps = () => {
        return stepMetadata.map((element) => {
            return (
                <div className="sidebar">
                    <ListItem button> {element.displayName[key]} </ListItem>
                </div>
                
            );
        });
    };*/

    const onModalClose = () => {
        setModalOpen(false);
    };

    const generateNewFieldPopup = () => {
        return (
            <CreateFieldModal
                isOpen={modalOpen}
                onModalClose={onModalClose}
                languageData={languageData}
            />
        );
    };

    return (
        <div>
            <div className="dashboard section-management-container">
                <div>
                    <Sidebar
                        languageData={languageData}
                        onClick={UpdateSelectedStep}
                        onDownPressed={onDownPressed}
                        onUpPressed={onUpPressed}
                        stepMetadata={stepMetadata}
                    />
                </div>
                {GenerateStepManagementContent()}
            </div>
            <span> {/*generateSteps()*/}</span>
            <div>
                <ListItem
                    className="sidebar"
                    button
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    Add New Field
                </ListItem>
            </div>
            {generateNewFieldPopup()}
        </div>
    );
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
