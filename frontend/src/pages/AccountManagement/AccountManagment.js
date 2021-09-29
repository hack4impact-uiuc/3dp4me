import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { getUsersByPageNumber, getRolesByPageNumber } from '../../api/api';
import {
    getAccessLevel,
    getEmail,
    getId,
    getName,
    getRoles,
    getRolesValue,
    getUsername,
} from '../../aws/aws-users';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import {
    COGNITO_ATTRIBUTES,
    getUserTableHeaders,
    LANGUAGES,
    USER_TABLE_ROW_DATA,
} from '../../utils/constants';
import {
    generateUserTableRowRenderer,
    userTableHeaderRenderer,
} from '../../utils/table-renderers';
import './AccountManagement.scss';

const USERS_PER_PAGE = 14;

/**
 * The account management screen. Allows admins to accept people into the
 * platform and assign roles.
 */
const AccountManagement = () => {
    const [translations, selectedLang] = useTranslations();
    const [userMetaData, setUserMetaData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [paginationToken, setPaginationToken] = useState('');
    const [usersLeft, setUsersLeft] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);

    const errorWrap = useErrorWrap();

    const fetchData = async () => {
        const userRes = await getUsersByPageNumber(
            paginationToken,
            USERS_PER_PAGE,
        );

        const totalUserMetaData = userMetaData.concat(userRes.result.Users);
        setUserMetaData(totalUserMetaData);

        const newPaginationToken = userRes.result.PaginationToken;

        if (newPaginationToken) {
            setPaginationToken(newPaginationToken);
        } else {
            setUsersLeft(false);
        }

        const rolesRes = await getRolesByPageNumber(pageNumber, USERS_PER_PAGE);
        const newRoles = rolesToMultiSelectFormat(rolesRes.result);
        const allRoles = rolesData.concat(newRoles);
        setRolesData(allRoles);

        setPageNumber(pageNumber + 1);
    };

    useEffect(() => {
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
            userId: getId(user),
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
            <>
                <SimpleTable
                    data={usersToTableFormat(userMetaData)}
                    headers={getUserTableHeaders(selectedLang)}
                    rowData={USER_TABLE_ROW_DATA}
                    renderHeader={userTableHeaderRenderer}
                    renderTableRow={generateUserTableRowRenderer(
                        onUserSelected,
                    )}
                />
            </>
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
                <div className="load-div">
                    {usersLeft ? (
                        <button
                            type="button"
                            className="load-more-btn"
                            onClick={() => errorWrap(fetchData)}
                        >
                            {translations.components.button.loadMore}
                        </button>
                    ) : (
                        <p className="load-more-text">No More Users</p>
                    )}
                </div>
            </div>
            {generateUserEditModal()}
        </div>
    );
};

export default AccountManagement;
