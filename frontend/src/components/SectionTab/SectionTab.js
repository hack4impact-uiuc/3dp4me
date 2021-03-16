import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { getStageMetadata } from '../../utils/api';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [step, setStep] = useState('pateintInfo');
    const [stepMetadata, setStepMetadata] = useState([]);

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
            </div>
        );
    });

    SectionTab.propTypes = {
        languageData: LanguageDataType.isRequired,
    };
};

export default SectionTab;
