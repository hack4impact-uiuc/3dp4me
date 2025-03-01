import './CustomSwitch.scss'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Switch from 'react-switch'

export interface CustomSwitchProps {
    checked: boolean
    setChecked: (v: boolean) => void
}

const CustomSwitch = ({ checked, setChecked }: CustomSwitchProps) => (
    <Switch
        onChange={setChecked}
        checked={checked}
        uncheckedHandleIcon={
            <div className="icon-div">
                <VisibilityOff />
            </div>
        }
        checkedHandleIcon={
            <div className="icon-div">
                <Visibility />
            </div>
        }
    />
)

export default CustomSwitch
