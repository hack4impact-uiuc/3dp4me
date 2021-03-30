import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { getStageMetadata } from '../../utils/api';
import ListItem from '@material-ui/core/ListItem';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [step, setStep] = useState('pateintInfo');
    const [stepMetadata, setStepMetadata] = useState([]);
    //const [updatedData, setUpdatedData] = useState(_.cloneDeep(stepData));

    const generateFields = () => {
        if (stepMetadata == null || stepMetadata.fields == null) return null;
        //if (updatedData == null) return null;
        return stepMetadata.fields.map((field) => {
            return (
                <label>
                    field.displayName;
                    <input type="" name="" />
                </label>
            );
        });
    };

    useEffect(async () => {
        const stepMetadata = await getStageMetadata();
        if (stepMetadata != null) {
            setStepMetadata(stepMetadata);
        }
    }, [setStepMetadata]);

    return stepMetadata.map((element, ...rest) => {
        return (
            <div className="sidebar">
                <ListItem button> {element.displayName[key]} </ListItem>
                <ListItem button></ListItem>
                generateFields();
            </div>
        );
    });
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
