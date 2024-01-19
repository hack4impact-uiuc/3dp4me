import './TextArea.scss'

import React from 'react'

export interface TextAreaProps<T extends string> {
    title: string
    disabled: boolean
    fieldId: T
    onChange: (key: T, value: string) => void
    value?: string
}

const TextArea = <T extends string>({
    title,
    disabled,
    fieldId,
    onChange,
    value = '',
}: TextAreaProps<T>) => (
    <div className="text-area-wrapper">
        <h3>{title}</h3>
        <div>
            <textarea
                disabled={disabled}
                onChange={(e) => onChange(fieldId, e.target.value)}
                value={value}
                className={disabled ? 'text-area-body' : 'text-area-body active-text-area'}
            />
        </div>
    </div>
)

export default TextArea
