import { InputBase, InputBaseProps, useTheme } from '@mui/material'

export const DropdownInput = (p: InputBaseProps) => {
    const theme = useTheme()

    return (
        <InputBase
            {...p}
            slotProps={{
                root: {
                    sx: {
                        'label + &': {
                            marginTop: theme.spacing(3),
                        },
                    },
                },
                input: {
                    sx: {
                        borderRadius: '4px',
                        position: 'relative',
                        backgroundColor: '#dedffb',
                        border: '1px solid #ced4da',
                        fontSize: 16,
                        padding: '10px 26px 10px 12px',
                        transition: theme.transitions.create(['border-color', 'box-shadow']),
                        // Use the system font instead of the default Roboto font.
                        '&:focus': {
                            borderRadius: '4px',
                            borderColor: '#80bdff',
                            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
                        },
                        selected: {
                            backgroundColor: '#dedffb',
                        },
                    },
                },
            }}
        />
    )
}
