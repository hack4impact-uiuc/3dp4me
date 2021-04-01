import React from 'react';
import { getAllUsers } from '../../aws/aws-helper';

const AccountManagement = () => {
    getAllUsers();
    return <div></div>;
};

export default AccountManagement;
