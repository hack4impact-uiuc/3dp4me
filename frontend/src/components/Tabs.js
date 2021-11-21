import { Tabs, Tab, Box } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const ColorTabs = ({ value, setValue }) => {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // TODO: Pass in labels as prop, values can also be the same thing , map all tabs, need to handle translations for labels

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
            >
                <Tab value="one" label="USERS" />
                <Tab value="two" label="ROLES" />
            </Tabs>
        </Box>
    );
};

ColorTabs.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
};

export { ColorTabs };
