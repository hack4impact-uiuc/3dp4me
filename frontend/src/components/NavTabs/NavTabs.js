import { Box, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import './NavTabs.scss';

const NavTabs = ({ value, setValue, labels, labelValues }) => {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
            >
                {labels.map((tabName ,i) => (
                    <Tab value={labelValues[i]} label={tabName} className="tab" />
                ))}
            </Tabs>
        </Box>
    );
};

NavTabs.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    labels: PropTypes.array.isRequired,
    labelValues: PropTypes.array.isRequired,
};

export { NavTabs };
