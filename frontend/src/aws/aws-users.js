import { ACCESS_LEVELS, COGNITO_ATTRIBUTES } from '../utils/constants';

const getAttr = (user, atr) => {
    return user?.Attributes?.find((attribute) => attribute.Name === atr)?.Value;
};

export const getAccessLevel = (user) => {
    return getAttr(user, COGNITO_ATTRIBUTES.ACCESS) || ACCESS_LEVELS.PENDING;
};

export const getName = (user) => {
    return getAttr(user, 'name') || user.Username;
};

export const getEmail = (user) => {
    return getAttr(user, 'email') || user.Username;
};

export const getUsername = (user) => {
    return user.Username;
};

export const getId = (user) => {
    return user.Username;
};

export const getRolesValue = (user) => {
    const info = getAttr(user, COGNITO_ATTRIBUTES.ROLES);
    return info ? JSON.parse(info) : [];
};

export const getRoles = (user, allRolesData, selectedLang) => {
    let roles = getRolesValue(user);
    if (roles.length === 0) return 'Not Assigned';

    roles = roles.map((r) => {
        for (let i = 0; i < allRolesData.length; i++) {
            if (r === allRolesData[i]._id)
                return allRolesData[i]?.Question[selectedLang];
        }

        return 'Unrecognized role';
    });

    return roles.join(', ');
};
