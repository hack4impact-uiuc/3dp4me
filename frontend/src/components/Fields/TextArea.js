import React from 'react';
import './TextArea.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { formatDate } from '../../utils/date';
import { useTranslations } from '../../hooks/useTranslations';

const TextArea = ({ title, disabled, fieldId, onChange, value = { data: '', lastEdited: Date.now(), lastEditedBy: '' } }) => {
    const [translations, selectedLang] = useTranslations();

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

        return <p className="last-edited-formatting">{text}</p>;
    };

    const handleUpdate = (e) => {
        const newData = e.target.value;
        const valueCopy = _.cloneDeep(value);
        _.set(valueCopy, 'data', newData);
        onChange(fieldId, valueCopy);
    }

    return (
        <div className="text-area-wrapper">
            <h3>{title}</h3>
            <div>
                <textarea
                    disabled={disabled}
                    onChange={handleUpdate}
                    value={value.data}
                    className={
                        disabled
                            ? 'text-area-body'
                            : 'text-area-body active-text-area'
                    }
                />
            </div>
            {generateLastEditedByAndDate()}
        </div>
    );
};

TextArea.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default TextArea;
