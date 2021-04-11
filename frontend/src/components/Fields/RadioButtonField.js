import React from 'react';

const RadioButtonField = ({ title, value, options, onChange }) => {
    const generateQuestions = () => {
        return <div></div>;
    };

    return (
        <div>
            <h3>{title}</h3>
            {generateQuestions()}
        </div>
    );
};

// TODO: Proptypes

export default RadioButtonField;
