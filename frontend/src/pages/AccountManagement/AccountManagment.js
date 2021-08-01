import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { LANGUAGES } from '../../utils/constants';
import { getAllRoles, getAllUsers } from '../../utils/api';
import MainUserTable from '../../components/Table/MainUserTable';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import { useTranslations } from '../../hooks/useTranslations';

const AccountManagement = () => {
    const selectedLang = useTranslations()[1];
    const [userMetaData, setUserMetaData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const errorWrap = useErrorWrap();

    useEffect(() => {
        const fetchData = async () => {
            const userRes = await getAllUsers();
            setUserMetaData(userRes.result.Users);

            const rolesRes = await getAllRoles();
            const roles = rolesRes.result.map((r) => ({
                _id: r?._id,
                IsHidden: r?.isHidden,
                Question: r?.roleName,
            }));

            setRolesData(roles);
        };
        errorWrap(fetchData);
    }, [setUserMetaData, errorWrap]);

    const onUserSelected = (user) => {
        setSelectedUser(user);
    };

    const onUserEdited = (username, accessLevel, roles) => {
        setUserMetaData((metaData) => {
            const updatedAccess = { Name: 'custom:access', Value: accessLevel };
            const updatedRoles = {
                Name: 'custom:security_roles',
                Value: JSON.stringify(roles),
            };

            const updatedUsers = _.cloneDeep(metaData);
            const userToUpdate = updatedUsers.find(
                (user) => user.Username === username,
            );

            userToUpdate.Attributes = userToUpdate.Attributes.filter(
                (attrib) =>
                    attrib.Name !== updatedAccess.Name &&
                    attrib.Name !== updatedRoles.Name,
            );
            userToUpdate.Attributes.push(updatedAccess);
            userToUpdate.Attributes.push(updatedRoles);

            return updatedUsers;
        });
    };

    function generateMainUserTable() {
        const headings = ['Name', 'Email', 'Role', 'Access'];
        if (getAllUsers() == null) return null;

        return (
            <MainUserTable
                headers={headings}
                rowIds={['Name', 'Email', 'Role', 'Access']}
                users={userMetaData}
                roleData={rolesData}
                onUserSelected={onUserSelected}
            />
        );
    }

    const generateUserEditModal = () => {
        return (
            <EditRoleModal
                isOpen={selectedUser !== null}
                userInfo={selectedUser}
                allRoles={rolesData}
                onClose={() => setSelectedUser(null)}
                onUserEdited={onUserEdited}
            />
        );
    };

    return (
        <div>
            <div className="dashboard" />
            <div className="patient-list">
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                selectedLang === LANGUAGES.AR
                                    ? 'patient-list-title-ar'
                                    : 'patient-list-title'
                            }
                        >
                            User Database
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
