import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getStageMetadata } from '../../utils/api';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);

    useEffect(async () => {
        const metadata = await getStageMetadata();
        if (metadata != null) {
            setStepMetadata(metadata);
        }
    }, [setStepMetadata]);

    return stepMetadata.map((element) => {
        return (
            <div className="sidebar">
                <ListItem button> {element.displayName[key]} </ListItem>
                <ListItem button />
            </div>
        );
    });
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
