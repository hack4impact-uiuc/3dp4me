import { Button } from '@material-ui/core';
import React from 'react';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import MultiSelectField from '../../components/Fields/MultiSelectField';

import { getAllUsers, removeUserRole } from '../../utils/api';

const AccountManagement = ({ languageData }) => {
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

    const MOCK_ALL_ROLES = [
        {
            IsHidden: false,
            _id: '0',
            Question: {
                EN: 'Admin',
                AR: 'Admin',
            },
        },
        {
            IsHidden: false,
            _id: '1',
            Question: {
                EN: 'Volunteer',
                AR: 'Volunteer',
            },
        },
        {
            IsHidden: false,
            _id: '2',
            Question: {
                EN: '3D Printer',
                AR: '3D Printer',
            },
        },
    ];

    let MOCK_UESR_ROLES = ['1'];

    return (
        <div className="dashboard">
            <EditRoleModal
                languageData={languageData}
                isOpen={true}
                userName="Matthew Walowski"
                userEmail="mattwalowski@gmail.com"
                allRoles={MOCK_ALL_ROLES}
                selectedRoles={MOCK_UESR_ROLES}
            />
            <Button onClick={addRole}> TEST BUTTONG </Button>
        </div>
    );
};

export default AccountManagement;
