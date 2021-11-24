import { Box, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import './NavTabs.scss';

const NavTabs = ({ value, setValue, labels }) => {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // TODO: Need to handle translations for labels

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
            >
                {labels.map((tabName) => (
                    <Tab value={tabName} label={tabName} className="tab" />
                ))}
            </Tabs>
        </Box>
    );
};

NavTabs.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    labels: PropTypes.array,
};

export { NavTabs };
