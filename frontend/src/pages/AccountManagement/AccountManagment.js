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

const USER_TABLE_HEADERS = [
    { title: 'Name', sortKey: 'Name' },
    { title: 'Email', sortKey: 'Email' },
    { title: 'Roles', sortKey: 'Roles' },
    { title: 'Access', sortKey: 'Access' },
];

const USER_TABLE_ROW_DATA = [
    { id: USER_TABLE_HEADERS[0].sortKey, dataType: FIELD_TYPES.STRING },
    { id: USER_TABLE_HEADERS[1].sortKey, dataType: FIELD_TYPES.STRING },
    { id: USER_TABLE_HEADERS[2].sortKey, dataType: FIELD_TYPES.STRING },
    { id: USER_TABLE_HEADERS[3].sortKey, dataType: FIELD_TYPES.ACCESS },
];

const AccountManagement = () => {
    const [translations, selectedLang] = useTranslations();
    const [userMetaData, setUserMetaData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const errorWrap = useErrorWrap();

    useEffect(() => {
        const fetchData = async () => {
            const userRes = await getAllUsers();
            setUserMetaData(userRes.result.Users);

            const rolesRes = await getAllRoles();
            const roles = rolesToMultiSelectFormat(rolesRes.result);

            setRolesData(roles);
        };
        errorWrap(fetchData);
    }, [setUserMetaData, errorWrap]);

    /**
     * Converts the roles response to a format useable by the MultiSelect field
     */
    const rolesToMultiSelectFormat = (roles) => {
        return roles.map((r) => ({
            _id: r?._id,
            IsHidden: r?.isHidden,
            Question: r?.roleName,
        }));
    };

    /**
     * Formats a user to a format useable by the EditRoleModal
     */
    const userToRoleModalFormat = (user) => {
        return {
            accessLevel: getAccessLevel(user),
            userId: getUsername(user),
            userName: getName(user),
            userEmail: getEmail(user),
            roles: getRolesValue(user),
        };
    };

    /**
     * Formats the users response to be useable by the table
     */
    const usersToTableFormat = (users) => {
        return users.map((user) => ({
            Username: getUsername(user),
            Name: getName(user),
            Email: getEmail(user),
            Roles: getRoles(user, rolesData, selectedLang),
            Access: getAccessLevel(user),
        }));
    };

    /**
     * Called when a user row is clicked on
     */
    const onUserSelected = (user) => {
        const userData = userMetaData.find((u) => u.Username === user.Username);

        setSelectedUser(userToRoleModalFormat(userData));
    };

    /**
     * Called when a user's data is updated
     */
    const onUserEdited = (username, accessLevel, roles) => {
        setUserMetaData((metaData) => {
            // Create updated access attribute
            const updatedAccess = {
                Name: COGNITO_ATTRIBUTES.ACCESS,
                Value: accessLevel,
            };

            // Create update role attribute
            const updatedRoles = {
                Name: COGNITO_ATTRIBUTES.ROLES,
                Value: JSON.stringify(roles),
            };

            // Clone the structure and find user
            const updatedUsers = _.cloneDeep(metaData);
            const userToUpdate = updatedUsers.find(
                (user) => user.Username === username,
            );

            // Do the update
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
        return (
            <MainTable
                data={usersToTableFormat(userMetaData)}
                headers={USER_TABLE_HEADERS}
                rowData={USER_TABLE_ROW_DATA}
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
                            {translations.accountManagement.userDatabase}
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
