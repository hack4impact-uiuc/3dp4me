import { ChangeEvent, HTMLInputTypeAttribute, SyntheticEvent } from 'react'
import Chip from '@mui/material/Chip';
// import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteValue } from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { TagOption } from './FormOption';
import { useTranslations } from '../../hooks/useTranslations';

export interface TagsFieldProps<T extends string> {
	displayName: string
	isDisabled?: boolean
	fieldId: T
	options: TagOption[]
	value?: TagOption[]
	onChange?: (key: T, value: string[]) => void
}

const TagsField = <T extends string>({
	displayName,
	isDisabled,
	value = [],
	options,
	fieldId,
	onChange = () => { },
}: TagsFieldProps<T>) => {
	const selectedLang = useTranslations()[1]

	return (
		<div>
			<h3 className="text-title">{displayName}</h3>
			<Autocomplete
				multiple
				id="fixed-tags-demo"
				value={value}
				onChange={(e, newValue) => {
					onChange(fieldId, newValue.map((v) => v._id))
				}}
				options={options}
				getOptionLabel={(option) => option.TagTitle[selectedLang]}
				renderTags={(tagValue, getTagProps) =>
					tagValue.map((option, index) => {
						const { key, ...tagProps } = getTagProps({ index });
						return (
							<Chip
								key={key}
								// TODO: VALUE?
								label={option.TagTitle[selectedLang]}
								{...tagProps}
								disabled={isDisabled}
							/>
						);
					})
				}
				// TODO: Width?
				style={{ width: 500 }}
				renderInput={(params) => (
					<TextField {...params} label="Fixed tag" placeholder="Favorites" />
				)}
			/>
		</div>

	)
}

export default TagsField
