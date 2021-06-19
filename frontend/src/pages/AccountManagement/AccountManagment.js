import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { addUserRole, getAllUsers, removeUserRole } from '../../utils/api';
import MainUserTable from '../../components/Table/MainUserTable';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const AccountManagement = ({ languageData }) => {
    const [userMetaData, setUserMetaData] = useState([]);
    const errorWrap = useErrorWrap();
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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

    useEffect(() => {
        const fetchData = async () => {
            errorWrap(async () => {
                const res = await getAllUsers();
                setUserMetaData(res.result.Users);
            });
        };
        fetchData();
    }, [setUserMetaData, errorWrap]);

    function generateMainUserTable() {
        const headings = ['Name', 'Email', 'Role', 'Access'];
        if (getAllUsers() == null) return null;

        return (
            <MainUserTable
                headers={headings}
                rowIds={['Name', 'Email', 'Role', 'Access']}
                /**rowIds={generateRowIds(element.key, element.fields)}**/
                languageData={languageData}
                users={userMetaData}
            />
        );
        //});
    }

    return (
        <div>
            <div className="dashboard"></div>
            <div className="patient-list">
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                key === 'AR'
                                    ? 'patient-list-title-ar'
                                    : 'patient-list-title'
                            }
                        >
                            {'User Database'}
                        </h2>

                        <Button
                            className="create-patient-button"
                            /* need to make modal to add account
                            onClick={addAccount}*/
                        >
                            {lang.components.button.addAccount}
                        </Button>
                    </div>
                </div>
                {generateMainUserTable()}
            </div>
        </div>
    );
};

export default AccountManagement;
