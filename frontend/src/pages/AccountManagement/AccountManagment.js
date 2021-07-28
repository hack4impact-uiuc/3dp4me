import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import {
    ACCESS_LEVELS,
    COGNITO_ATTRIBUTES,
    FIELD_TYPES,
    LANGUAGES,
} from '../../utils/constants';
import { getAllRoles, getAllUsers } from '../../utils/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import { useTranslations } from '../../hooks/useTranslations';
import MainTable from '../../components/Table/MainTable';
import {
    generateUserTableRowRenderer,
    userTableHeaderRenderer,
} from '../../utils/table-renderers';
import {
    getAccessLevel,
    getEmail,
    getName,
    getRoles,
    getRolesValue,
    getUsername,
} from '../../aws/aws-users';

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
        const fullUserData = userMetaData.find(
            (u) => u.Username === user.Username,
        );

        setSelectedUser({
            accessLevel: getAccessLevel(fullUserData),
            userId: getUsername(fullUserData),
            userName: getName(fullUserData),
            userEmail: getEmail(fullUserData),
            roles: getRolesValue(fullUserData),
        });
    };

    const onUserEdited = (username, accessLevel, roles) => {
        setUserMetaData((metaData) => {
            const updatedAccess = {
                Name: COGNITO_ATTRIBUTES.ACCESS,
                Value: accessLevel,
            };
            const updatedRoles = {
                Name: COGNITO_ATTRIBUTES.ROLES,
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

    const transformData = (users) => {
        return users.map((user) => ({
            Username: getUsername(user),
            Name: getName(user),
            Email: getEmail(user),
            Roles: getRoles(user, rolesData, selectedLang),
            Access: getAccessLevel(user),
        }));
    };

    function generateMainUserTable() {
        const headings = [
            { title: 'Name', sortKey: 'Name', dataType: FIELD_TYPES.STRING },
            { title: 'Email', sortKey: 'Email', dataType: FIELD_TYPES.STRING },
            { title: 'Roles', sortKey: 'Roles', dataType: FIELD_TYPES.STRING },
            {
                title: 'Access',
                sortKey: 'Access',
                dataType: FIELD_TYPES.STRING,
            },
        ];

        const rowData = [
            { id: 'Name', dataType: FIELD_TYPES.STRING },
            { id: 'Email', dataType: FIELD_TYPES.STRING },
            { id: 'Roles', dataType: FIELD_TYPES.STRING },
            { id: 'Access', dataType: FIELD_TYPES.ACCESS },
        ];

        return (
            <MainTable
                data={transformData(userMetaData)}
                headers={headings}
                rowData={rowData}
                renderHeader={userTableHeaderRenderer}
                renderTableRow={generateUserTableRowRenderer(onUserSelected)}
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
