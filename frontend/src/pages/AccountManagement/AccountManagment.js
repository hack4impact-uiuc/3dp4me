import { Button } from '@material-ui/core';
import React from 'react';
import { addUserRole, getAllUsers } from '../../utils/api';

const AccountManagement = () => {
    const addRole = async () => {
        console.log(await getAllUsers());
        console.log(
            await addUserRole(
                'google_107210067228697709799',
                '606e0a4602b23d02bc77673b',
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
