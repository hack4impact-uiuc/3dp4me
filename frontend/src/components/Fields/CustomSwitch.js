import './CustomSwitch.scss';
import React, { useState } from 'react';
import Switch from 'react-switch';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import PropTypes from 'prop-types';

const CustomSwitch = ({ initialChecked }) => {
    const [checked, setChecked] = useState(initialChecked);

    return (
        <label>
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
        </label>
    );
};

CustomSwitch.propTypes = {
    initialChecked: PropTypes.bool.isRequired,
};

export default CustomSwitch;
