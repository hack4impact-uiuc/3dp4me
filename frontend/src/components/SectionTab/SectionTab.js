import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { getStageMetadata } from '../../utils/api';

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
                <ListItem key={element.displayName[key]} button {...rest}>
                    <ListItemText>{element.displayName[key]}</ListItemText>
                </ListItem>
            </div>
        );
    });

    function generateTabs(element) {
        return stepMetadata.map((element) => {
            return {
                title: element.displayName[key],
            };
            return null;
        });

        SectionTab.propTypes = {
            languageData: LanguageDataType.isRequired,
        };
    }
};

export default SectionTab;
