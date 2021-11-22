import _ from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';

import { NavTabs } from '../../components/Tabs';
import {
    getUsersByPageNumber,
    getUsersByPageNumberAndToken,
    getAllRoles,
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
import { StyledButton } from '../../components/StyledButton/StyledButton';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import AddRoleModal from '../../components/AddRoleModal/AddRoleModal';
import ManageRoleModal from '../../components/ManageRoleModal/ManageRoleModal';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import {
    COGNITO_ATTRIBUTES,
    getUserTableHeaders,
    getRoleTableHeaders,
    LANGUAGES,
    USER_TABLE_ROW_DATA,
    ROLE_TABLE_ROW_DATA,
    PEOPLE_PER_PAGE,
} from '../../utils/constants';
import { rolesToMultiSelectFormat } from '../../utils/utils';
import {
    generateUserTableRowRenderer,
    userTableHeaderRenderer,
} from '../../utils/table-renderers';
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
    const [selectedTab, setSelectedTab] = useState('one');
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const memoizedMultiSelectRoles = useMemo(
        () => rolesToMultiSelectFormat(roles),
        [roles],
    );

    const errorWrap = useErrorWrap();

    const fetchMoreUsers = async () => {
        const userRes = await getUsersByPageNumberAndToken(
            paginationToken,
            PEOPLE_PER_PAGE,
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
                const rolesRes = await getAllRoles();
                setRoles(rolesRes.result);
            };

            const fetchInitialUsers = async () => {
                const userRes = await getUsersByPageNumber(PEOPLE_PER_PAGE);

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
    // TODO: Should I add setRoles as dependency?

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

    // TODO: write docs
    // TODO: Can add role descriptions here
    const rolesToTableFormat = (rolesData) => {
        return rolesData.map((role) => ({
            Name: role?.roleName[selectedLang],
            // Description: role?.roleDescription[selectedLang],
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
        const roleData = roles.find(
            (u) => u.roleName[selectedLang] === user.Name,
        );

        setSelectedRole(roleData);
    };

    // TODO: Write documentation for all of the functions
    // TODO: Extract Modal Component with CSS or create folder for modals

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

    // TODO: add docs, better way to do this?
    const onRoleDeleted = (roleId) => {
        const updatedRoles = roles.filter((role) => role._id !== roleId);
        setRoles(updatedRoles);
    };

    // TODO: add docs, better way to do this?
    const onRoleEdited = (roleId, roleData) => {
        const updatedRoles = _.cloneDeep(roles);
        const updatedRole = updatedRoles.find((role) => role._id === roleId);
        updatedRole.roleName = roleData.roleName;
        updatedRole.roleDescription = roleData.roleDescription;
        setRoles(updatedRoles);
    };

    // TODO: add docs, ask if there's a better way to do this
    const onRoleAdded = (role) => {
        const updatedRoles = roles.concat([role]);
        setRoles(updatedRoles);
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
        if (selectedTab === 'one') {
            return generateMainUserTable();
        }
        if (selectedTab === 'two') {
            return generateMainRoleTable();
        }
    };

    const generateDatabaseTitle = () => {
        if (selectedTab === 'one') {
            return translations.accountManagement.userDatabase;
        }
        if (selectedTab === 'two') {
            return translations.roleManagement.roleDatabase;
        }
    };

    const generateButton = () => {
        if (selectedTab === 'two') {
            return (
                <StyledButton primary onClick={onRoleButtonClick}>
                    {translations.roleManagement.addRole}
                </StyledButton>
            );
        }
    };

    const onRoleButtonClick = () => {
        setIsAddRoleModalOpen(true);
    };

    // TODO: change selectedTab names and generalize with arrays

    return (
        <div>
            <div className="dashboard" />
            <div className="patient-list">
                <NavTabs value={selectedTab} setValue={setSelectedTab} />
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                selectedLang === LANGUAGES.AR
                                    ? 'patient-list-title-ar'
                                    : 'patient-list-title'
                            }
                        >
                            {generateDatabaseTitle()}
                        </h2>
                        {generateButton()}
                    </div>
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
