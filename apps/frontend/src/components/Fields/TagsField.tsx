import Text from '@material-ui/core/TextField'
import { ChangeEvent, HTMLInputTypeAttribute } from 'react'
import Chip from '@mui/material/Chip';
// import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export interface TagsFieldProps<T extends string> {
    displayName: string
    isDisabled?: boolean
    fieldId: T
    value?: string
    className?: string
    onChange?: (key: T, value: string) => void
}

const TagsField = <T extends string>({
    displayName,
    type = '',
    isDisabled,
    value = '',
    className = '',
    fieldId,
    onChange = () => {},
}: TagsField<T>) => {
    const inputClassName = !isDisabled ? 'active-input' : 'input-field'

    const sendChanges = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(fieldId, e.target.value)
    }

    // return (
    //     <div>
    //         <h3 className="text-title">{displayName}</h3>
    //         <Text
    //             type={type}
    //             disabled={isDisabled}
    //             className={`${inputClassName} ${className} text-value`}
    //             variant="outlined"
    //             onChange={sendChanges}
    //             value={value}
    //         />
    //     </div>
    // )

    return (
        <Autocomplete
          multiple
          id="fixed-tags-demo"
          value={value}
          onChange={(event, newValue) => {
            setValue([
              ...fixedOptions,
              ...newValue.filter((option) => !fixedOptions.includes(option)),
            ]);
          }}
          options={top100Films}
          getOptionLabel={(option) => option.title}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.title}
                  {...tagProps}
                  disabled={fixedOptions.includes(option)}
                />
              );
            })
          }
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField {...params} label="Fixed tag" placeholder="Favorites" />
          )}
        />
    )
}

export default TagsField
