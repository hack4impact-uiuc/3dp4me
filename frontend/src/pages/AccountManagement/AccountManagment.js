import React, { useState, useEffect } from 'react';
import { getAllUsers, removeUserRole } from '../../utils/api';
import MainUserTable from '../../components/Table/MainUserTable';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import { ACCESS_LEVELS } from '../../utils/constants';

const AccountManagement = ({ languageData }) => {
    const [userMetaData, setUserMetaData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const errorWrap = useErrorWrap();
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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

    useEffect(() => {
        const fetchData = async () => {
            errorWrap(async () => {
                const res = await getAllUsers();
                setUserMetaData(res.result.Users);
            });
        };
        fetchData();
    }, [setUserMetaData, errorWrap]);

    const onUserSelected = (user) => {
        setSelectedUser(user);
    };

    function generateMainUserTable() {
        const headings = ['Name', 'Email', 'Role', 'Access'];
        if (getAllUsers() == null) return null;

        return (
            <MainUserTable
                headers={headings}
                rowIds={['Name', 'Email', 'Role', 'Access']}
                languageData={languageData}
                users={userMetaData}
                onUserSelected={onUserSelected}
            />
        );
    }

    const generateUserEditModal = () => {
        return (
            <EditRoleModal
                languageData={languageData}
                isOpen={selectedUser !== null}
                userInfo={selectedUser}
                allRoles={MOCK_ALL_ROLES}
                onClose={() => setSelectedUser(null)}
            />
        );
    };

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
                    </div>
                </div>
                {generateMainUserTable()}
            </div>
            {generateUserEditModal()}
        </div>
    );
};

export default AccountManagement;
