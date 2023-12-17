import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';

import {
    getAllRoles,
    getUsersByPageNumber,
    getUsersByPageNumberAndToken,
} from '../../api/api';
import {
    getAccessLevel,
    getEmail,
    getId,
    getName,
    getRoles,
    getRolesValue,
    getUsername,
} from '../../aws/aws-users';
import AddRoleModal from '../../components/AddRoleModal/AddRoleModal';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import ManageRoleModal from '../../components/ManageRoleModal/ManageRoleModal';
import { NavTabs } from '../../components/NavTabs/NavTabs';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import { StyledButton } from '../../components/StyledButton/StyledButton';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import {
    ACCOUNT_MANAGEMENT_TABS,
    ACCOUNT_MANAGEMENT_TAB_NAMES,
    COGNITO_ATTRIBUTES,
    getRoleTableHeaders,
    getUserTableHeaders,
    PEOPLE_PER_PAGE,
    ROLE_TABLE_ROW_DATA,
    USER_TABLE_ROW_DATA,
} from '../../utils/constants';
import {
    generateUserTableRowRenderer,
    userTableHeaderRenderer,
} from '../../utils/table-renderers';
import { rolesToMultiSelectFormat } from '../../utils/utils';
import './AccountManagement.scss';

/**
 * The account management screen. Allows admins to accept people into the
 * platform and assign roles.
 */
const AccountManagement = () => {
    const [translations, selectedLang] = useTranslations();
    const [userMetaData, setUserMetaData] = useState([]);
    const [roles, setRoles] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [paginationToken, setPaginationToken] = useState('');
    const [isUserLeft, setIsUserLeft] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [selectedTab, setSelectedTab] = useState(
        ACCOUNT_MANAGEMENT_TABS.USERS,
    );
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const memoizedMultiSelectRoles = useMemo(
        () => rolesToMultiSelectFormat(roles),
        [roles],
    );

    const errorWrap = useErrorWrap();

    const fetchMoreUsers = async () => {
        const userRes = await trackPromise(
            getUsersByPageNumberAndToken(paginationToken, PEOPLE_PER_PAGE),
        );

        const totalUserMetaData = userMetaData.concat(userRes.result.Users);
        setUserMetaData(totalUserMetaData);

        const newPaginationToken = userRes.result.PaginationToken;

        if (newPaginationToken) {
            setPaginationToken(newPaginationToken);
        } else {
            setIsUserLeft(false);
        }

        setPageNumber(pageNumber + 1);
    };

    useEffect(() => {
        errorWrap(async () => {
            const fetchRoles = async () => {
                const rolesRes = await trackPromise(getAllRoles());
                setRoles(rolesRes.result);
            };

            const fetchInitialUsers = async () => {
                const userRes = await trackPromise(
                    getUsersByPageNumber(PEOPLE_PER_PAGE),
                );

                const totalUserMetaData = userRes.result.Users;
                setUserMetaData(totalUserMetaData);

                const newPaginationToken = userRes.result.PaginationToken;

                if (newPaginationToken) {
                    setPaginationToken(newPaginationToken);
                } else {
                    setIsUserLeft(false);
                }

                setPageNumber(1);
            };

            await fetchRoles();
            await fetchInitialUsers();
        });
    }, [setUserMetaData, errorWrap, setRoles]);

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
            Roles: getRoles(user, memoizedMultiSelectRoles, selectedLang),
            Access: getAccessLevel(user),
        }));
    };

    /**
     * Formats the roles response to be useable by the table
     */
    const rolesToTableFormat = (rolesData) => {
        return rolesData.map((role) => ({
            Name: role?.roleName[selectedLang],
            _id: role?._id,
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
     * Called when a role row is clicked on
     */
    const onRoleSelected = (user) => {
        const roleData = roles.find((u) => u._id === user._id);
        setSelectedRole(roleData);
    };

    /**
     * Called when a user's data is updated
     */
    const onUserEdited = (username, accessLevel, rolesData) => {
        setUserMetaData((metaData) => {
            // Create updated access attribute
            const updatedAccess = {
                Name: COGNITO_ATTRIBUTES.ACCESS,
                Value: accessLevel,
            };

            // Create update role attribute
            const updatedRoles = {
                Name: COGNITO_ATTRIBUTES.ROLES,
                Value: JSON.stringify(rolesData),
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

    const onUserDeleted = (username) => {
        setUserMetaData((metaData) => {
            const users = _.cloneDeep(metaData);
            const updatedUsers = users.filter(
                (user) => user.Username !== username,
            );
            return updatedUsers;
        });
    };

    /**
     * Called when a role's data is deleted
     */
    const onRoleDeleted = (roleId) => {
        setRoles((rolesData) => {
            const updatedRoles = rolesData.filter(
                (role) => role._id !== roleId,
            );
            return updatedRoles;
        });
    };

    /**
     * Called when a role's data is modified
     */
    const onRoleEdited = (roleId, roleData) => {
        setRoles((rolesData) => {
            const updatedRoles = _.cloneDeep(rolesData);
            const updatedRole = updatedRoles.find(
                (role) => role._id === roleId,
            );
            updatedRole.roleName = roleData.roleName;
            updatedRole.roleDescription = roleData.roleDescription;
            return updatedRoles;
        });
    };

    /**
     * Called when a role's data is added
     */
    const onRoleAdded = (role) => {
        setRoles((rolesData) => {
            const updatedRoles = rolesData.concat([role]);
            return updatedRoles;
        });
    };

    const generateMainUserTable = () => {
        return (
            <SimpleTable
                data={usersToTableFormat(userMetaData)}
                headers={getUserTableHeaders(selectedLang)}
                rowData={USER_TABLE_ROW_DATA}
                renderHeader={userTableHeaderRenderer}
                renderTableRow={generateUserTableRowRenderer(onUserSelected)}
            />
        );
    };

    const generateMainRoleTable = () => {
        return (
            <SimpleTable
                data={rolesToTableFormat(roles)}
                headers={getRoleTableHeaders(selectedLang)}
                rowData={ROLE_TABLE_ROW_DATA}
                renderHeader={userTableHeaderRenderer}
                renderTableRow={generateUserTableRowRenderer(onRoleSelected)}
            />
        );
    };

    const generateLoadMoreBtn = () => {
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.ROLES) {
            return <></>;
        }
        return isUserLeft ? (
            <div className="load-div">
                <button
                    type="button"
                    className="load-more-btn"
                    onClick={() => errorWrap(fetchMoreUsers)}
                >
                    {translations.components.button.loadMore}
                </button>
            </div>
        ) : (
            <div className="load-div">
                <p className="load-more-text">
                    {translations.components.button.noMoreUsers}
                </p>
            </div>
        );
    };

    const generateUserEditModal = () => {
        return (
            <EditRoleModal
                isOpen={selectedUser !== null}
                userInfo={selectedUser}
                allRoles={memoizedMultiSelectRoles}
                onClose={() => setSelectedUser(null)}
                onUserEdited={onUserEdited}
                onUserDeleted={onUserDeleted}
            />
        );
    };

    const generateRoleEditModal = () => {
        return (
            <ManageRoleModal
                isOpen={selectedRole !== null}
                roleInfo={selectedRole}
                onClose={() => setSelectedRole(null)}
                onRoleDeleted={onRoleDeleted}
                onRoleEdited={onRoleEdited}
            />
        );
    };

    const generateAddRoleModal = () => {
        return (
            <AddRoleModal
                isOpen={isAddRoleModalOpen}
                onClose={() => setIsAddRoleModalOpen(false)}
                onRoleAdded={onRoleAdded}
            />
        );
    };

    const generateTable = () => {
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.USERS) {
            return generateMainUserTable();
        }
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.ROLES) {
            return generateMainRoleTable();
        }
        return <></>;
    };

    const generateDatabaseTitle = () => {
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.USERS) {
            return translations.accountManagement.userDatabase;
        }
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.ROLES) {
            return translations.roleManagement.roleDatabase;
        }
        return <></>;
    };

    const generateButton = () => {
        if (selectedTab === ACCOUNT_MANAGEMENT_TABS.ROLES) {
            return (
                <StyledButton primary onClick={onRoleButtonClick}>
                    {translations.roleManagement.addRole}
                </StyledButton>
            );
        }
        return <></>;
    };

    const onRoleButtonClick = () => {
        setIsAddRoleModalOpen(true);
    };

    return (
        <div>
            <div className="dashboard" />
            <div className="patient-list">
                <div className="header account-header">
                    <div className="section">
                        <h2 className="patient-list-title">
                            {generateDatabaseTitle()}
                        </h2>
                        {generateButton()}
                    </div>
                </div>
                <div className="tab-container">
                    <NavTabs
                        value={selectedTab}
                        setValue={setSelectedTab}
                        labels={ACCOUNT_MANAGEMENT_TAB_NAMES[selectedLang]}
                        labelValues={Object.values(ACCOUNT_MANAGEMENT_TABS)}
                    />
                </div>
                {generateTable()}
                {generateLoadMoreBtn()}
            </div>
            {generateUserEditModal()}
            {generateRoleEditModal()}
            {generateAddRoleModal()}
        </div>
    );
};

export default AccountManagement;
