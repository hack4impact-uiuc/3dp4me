import './SectionTab.css';
import React, { useState, useEffect } from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';
import Sidebar from '../Sidebar/Sidebar';
import StepManagementContent from '../StepManagementContent/StepManagementContent';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);
    const [selectedStep, setSelectedStep] = useState('');

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

    function UpdateSelectedStep(stepKey) {
        setSelectedStep(stepKey);
    }

    useEffect(() => {
        const fetchData = async () => {
            const metadata = await getAllStepsMetadata();
            if (metadata != null) {
                setStepMetadata(metadata);
            }
            if (metadata.length > 1) {
                setSelectedStep(metadata[0].key);
            }
        };
        fetchData();
    }, [setStepMetadata]);

    return (
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
    );
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
