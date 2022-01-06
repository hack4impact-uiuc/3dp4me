import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { formatDate } from '../../utils/date';
import { useTranslations } from '../../hooks/useTranslations';
import TextArea from './TextArea';
import './MultiLineField.scss';
import { Context } from '../../store/Store';

const MultiLineField = ({ title, disabled, fieldId, onChange, value = { data: '', lastEdited: Date.now(), lastEditedBy: '' } }) => {
    const [translations, selectedLang] = useTranslations();
    const [state] = useContext(Context);

    const generateLastEditedByAndDate = () => {
        let text;

        // Displays none if the lastEditedBy field is set to the default value
        if (value.lastEditedBy === '') {
            text = `${translations.components.step.lastEditedBy} ${translations.components.step.none}`;
        } else {
            text = `${translations.components.step.lastEditedBy} ${value.lastEditedBy} ${translations.components.step.on} ${formatDate(
                value.lastEdited,
                selectedLang,
            )}`;
        }

        return <p className="last-edited-text">{text}</p>;
    };

    const handleUpdate = (fieldId, newData) => {
        const valueCopy = _.cloneDeep(value);
        valueCopy.data = newData;
        valueCopy.lastEdited = Date.now();
        valueCopy.lastEditedBy = state.username;
        onChange(fieldId, valueCopy);
    }

    return (
        <>
            <TextArea
                disabled={disabled}
                onChange={handleUpdate}
                title={title}
                fieldId={fieldId}
                value={value.data}
            />
            {generateLastEditedByAndDate()}
        </>
    );
};

MultiLineField.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default MultiLineField;
