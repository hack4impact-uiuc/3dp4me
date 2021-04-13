import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';
import Sidebar from '../Sidebar/Sidebar';
import StepManagementContent from '../StepManagementContent/StepManagementContent';
import CreateFieldModal from '../CreateFieldModal/CreateFieldModal';
import { rest } from 'lodash';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    function GenerateStepManagementContent() {
        return stepMetadata.map((element) => {
            if (selectedStep != element.key) {
                return null;
            }
            return (
                <StepManagementContent
                    languageData={languageData}
                    fields={element.fields}
                />
            );
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllStepsMetadata();

            if (res != null) {
                setStepMetadata(res.result);
            }
            if (res.result > 1) {
                setSelectedStep(res[0].key);
            }
            if (!res?.success || !res?.result) return;

            setStepMetadata(res.result);
        };
        fetchData();
    }, [setStepMetadata]);

    const generateSteps = () => {
        return stepMetadata.map((element) => {
            return (
                <div className="sidebar">
                    <ListItem button> {element.displayName[key]} </ListItem>
                </div>
            );
        });
    };

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
                        stepMetadata={stepMetadata}
                    />
                </div>
                {GenerateStepManagementContent()}
            </div>
            <span> {generateSteps()}</span>
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
