import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { ACCESS_LEVELS, FIELD_TYPES, LANGUAGES } from '../../utils/constants';
import { getAllRoles, getAllUsers } from '../../utils/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import EditRoleModal from '../../components/EditRoleModal/EditRoleModal';
import { useTranslations } from '../../hooks/useTranslations';
import MainTable from '../../components/Table/MainTable';
import {
    userTableHeaderRenderer,
    userTableRowRenderer,
} from '../../utils/table-renderers';

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

    const transformData = (users) => {
        const getInfo = (user, atr) => {
            return user?.Attributes?.find((attribute) => attribute.Name === atr)
                ?.Value;
        };

        const getAccessLevelValue = (user) => {
            return getInfo(user, 'custom:access') || ACCESS_LEVELS.PENDING;
        };

        const getAccessLevel = (user) => {
            const access = getAccessLevelValue(user);
            return access;
            //return statusStyle[access];
        };

        const getName = (user) => {
            return getInfo(user, 'name') || user.Username;
        };

        const getId = (user) => {
            return user.Username;
        };

        const getRolesValue = (user) => {
            const info = getInfo(user, 'custom:security_roles');
            return info ? JSON.parse(info) : [];
        };

        const getRoles = (user) => {
            let roles = getRolesValue(user);
            if (roles.length === 0) return 'Not Assigned';

            roles = roles.map((r) => {
                for (let i = 0; i < rolesData.length; i += 1) {
                    if (r === rolesData[i]._id)
                        return rolesData[i]?.Question[selectedLang];
                }

                return 'Unrecognized role';
            });

            return roles.join(', ');
        };

        return users.map((user) => ({
            Name: getName(user),
            Email: getInfo(user, 'email'),
            Roles: getRoles(user),
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
            { id: 'Access', dataType: FIELD_TYPES.STRING },
        ];

        console.log(userMetaData);
        return (
            <MainTable
                data={transformData(userMetaData)}
                headers={headings}
                rowData={rowData}
                renderHeader={userTableHeaderRenderer}
                renderTableRow={userTableRowRenderer}
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
