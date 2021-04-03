import { Button } from '@material-ui/core';
import React from 'react';
import { getAllUsers } from '../../utils/api';

const AccountManagement = () => {
    const addRole = async () => {
        console.log(await getAllUsers());
    };

    return (
        <div className="dashboard">
            <Button onClick={addRole}> TEST BUTTONG </Button>
        </div>
    );
};

export default AccountManagement;
