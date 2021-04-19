import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { addUserRole, getAllUsers, removeUserRole } from '../../utils/api';
import MainUserTable from '../../components/Table/MainTable';

const AccountManagement = ({ languageData }) => {
    const [userMetaData, setUserMetaData] = useState(getAllUsers());

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

    function generateMainUserTable() {
        console.log(userMetaData);
        const headings = ['Name', 'Email', 'Role', 'Access'];
        if (getAllUsers() == null) return null;
        ///return getAllUsers().map((element) => {

        return (
            <MainUserTable
                headers={headings}
                /**rowIds={generateRowIds(element.key, element.fields)}**/
                languageData={
                    languageData
                } /**
                    patients={
                        searchQuery.length === 0 ? patients : filteredPatients
                    }**/
            />
        );
        //});
    }

    return (
        <div>
            <div className="dashboard">
                <Button onClick={addRole}> TEST BUTTONG </Button>
            </div>
            {generateMainUserTable()}
        </div>
    );
};

export default AccountManagement;
