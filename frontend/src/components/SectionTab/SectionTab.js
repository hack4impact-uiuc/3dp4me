import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const metadata = await getAllStepsMetadata();
            if (metadata != null) {
                setStepMetadata(metadata);
            }
        };
        fetchData();
    }, [setStepMetadata]);

    return stepMetadata.map((element) => {
        return (
            <div className="sidebar">
                <ListItem button> {element.displayName[key]} </ListItem>
            </div>
        );
    });
};

SectionTab.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default SectionTab;
