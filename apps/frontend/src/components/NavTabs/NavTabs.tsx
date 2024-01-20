import './NavTabs.scss'

import { Box, Tab, Tabs } from '@material-ui/core'
import React from 'react'

export interface NavTabsProps {
    value: string
    setValue: (v: string) => void
    labels: string[]
    labelValues: string[]
}

const NavTabs = ({ value, setValue, labels, labelValues }: NavTabsProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (_: any, newValue: string) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
            >
                {labels.map((tabName, i) => (
                    <Tab value={labelValues[i]} label={tabName} className="tab" />
                ))}
            </Tabs>
        </Box>
    )
}

export { NavTabs }
