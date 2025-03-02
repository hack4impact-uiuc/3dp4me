import { TextField } from '@mui/material'
// import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'

import { useTranslations } from '../../hooks/useTranslations'
import { TagOption } from './FormOption'

export interface TagsFieldProps<T extends string> {
    displayName: string
    isDisabled?: boolean
    fieldId: T
    options: TagOption[]
    isLoading?: boolean
    value?: TagOption[]
    onChange?: (key: T, value: string[]) => void
}

const TagsField = <T extends string>({
    displayName,
    isDisabled,
    options,
    fieldId,
    isLoading = false,
    value = [],
    onChange = () => {},
}: TagsFieldProps<T>) => {
    const [translations, selectedLang] = useTranslations()

    return (
        <div>
            <h3 className="text-title">{displayName}</h3>
            <Autocomplete
                loading={isLoading}
                multiple
                id="fixed-tags-demo"
                value={value}
                loadingText={translations.components.table.loading}
                onChange={(e, newValue) => {
                    onChange(
                        fieldId,
                        newValue.map((v) => v._id)
                    )
                }}
                options={options}
                getOptionLabel={(option) => option.TagTitle[selectedLang]}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index })
                        return (
                            <Chip
                                key={key}
                                label={option.TagTitle[selectedLang]}
                                {...tagProps}
                                disabled={isDisabled}
                            />
                        )
                    })
                }
                style={{ width: '300px', marginBottom: '20px' }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={translations.components.swal.managePatient.patientTags}
                    />
                )}
            />
        </div>
    )
}

export default TagsField
