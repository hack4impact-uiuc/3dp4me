import './CustomSwitch.scss';
import React from 'react';
import Switch from 'react-switch';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import PropTypes from 'prop-types';

const CustomSwitch = ({ checked, setChecked }) => {
    return (
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
    );
};

CustomSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    setChecked: PropTypes.func.isRequired,
};

export default CustomSwitch;
