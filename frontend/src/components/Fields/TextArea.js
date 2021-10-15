import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './TextArea.scss';

const TextArea = forwardRef(({ title, disabled, initValue }, ref) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value: value
        }),
    )

    return (
        <div className="text-area-wrapper">
            <h3>{title}</h3>
            <div>
                <textarea
                    disabled={disabled}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    className={
                        disabled
                            ? 'text-area-body'
                            : 'text-area-body active-text-area'
                    }
                />
            </div>
        </div>
    );
});

TextArea.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    initValue: PropTypes.string,
};

export default TextArea;
