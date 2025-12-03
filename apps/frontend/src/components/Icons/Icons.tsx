import Clear from '@mui/icons-material/Clear'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { styled } from '@mui/material'

/**
 * These are icons that used to be from semantic UI
 *
 * Since that bundle is huge and the style isn't very react-ish, replacing with styled MUI icons
 */

export const PencilIcon = styled(CreateIcon)({
    height: '100%',
})

export const ChevronDownIcon = styled(KeyboardArrowDownIcon)({
    height: '100%',
})

export const ChevronUpIcon = styled(KeyboardArrowUpIcon)({
    height: '100%',
})

export const ChevronLeftIcon = styled(KeyboardArrowLeftIcon)({
    height: '100%',
})

export const ChevronRightIcon = styled(KeyboardArrowRightIcon)({
    height: '100%',
})

export const ClearIcon = styled(Clear)({
    height: '100%',
})

export const PlusIcon = styled(AddIcon)({
    height: '100%',
})