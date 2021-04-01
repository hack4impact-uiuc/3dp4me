import './SectionTab.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';
import CreateFieldModal from '../CreateFieldModal/CreateFieldModal';

const SectionTab = ({ languageData }) => {
    const key = languageData.selectedLanguage;
    const [stepMetadata, setStepMetadata] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllStepsMetadata();
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
