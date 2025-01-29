import './CustomSwitch.scss'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
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
