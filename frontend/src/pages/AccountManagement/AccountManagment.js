import { Button } from '@material-ui/core';
import React from 'react';
import { getAllUsers } from '../../utils/api';

import { addUserRole, getAllUsers } from '../../utils/api';

const AccountManagement = () => {
    const addRole = async () => {
        console.log(await getAllUsers());
        console.log(await addUserRole('google_107210067228697709799', 'ADMIN'));
    };

    return (
        <div className="dashboard">
            <Button onClick={addRole}> TEST BUTTONG </Button>
        </div>
    );
};

export default AccountManagement;
