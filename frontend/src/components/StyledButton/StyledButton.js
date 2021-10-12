import React from 'react';
import './StyledButton.scss';
import { LANGUAGES} from '../../utils/constants';
import { Button } from '@material-ui/core';
import { useTranslations } from '../../hooks/useTranslations';

const StyledButton = ({onClick, children}) => {
    // TODO: translations and change other buttons to use this component
    const selectedLang = useTranslations()[1];
    const saveBtnClassName = selectedLang === LANGUAGES.AR ? 'save-button-ar' : 'save-button';

    return (
        <div className={"button-wrapper"}>
            <Button
                key="bottom-bar-save"
                className={saveBtnClassName}
                onClick={onClick}
            >
                {children}
            </Button>
        </div> 
    );
};

export {StyledButton}


