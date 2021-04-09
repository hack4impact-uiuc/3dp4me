import { Button } from '@material-ui/core';
import React from 'react';
import { addUserRole, getAllUsers, removeUserRole } from '../../utils/api';

const AccountManagement = () => {
    const addRole = async () => {
        // This is just for testing, feel free to replace this once we have a functioning dashboard
        console.log(await getAllUsers());
        console.log(
            await removeUserRole(
                'google_107210067228697709799',
                '606e0a8b02b23d02bc77673e',
            ),
        );
    };

    return (
        <div className="dashboard">
            <Button onClick={addRole}> TEST BUTTONG </Button>
        </div>
    );
};

export default AccountManagement;
