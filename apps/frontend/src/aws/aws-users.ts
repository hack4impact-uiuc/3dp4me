import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { COGNITO_ATTRIBUTES } from '../utils/constants';
import { AccessLevel, Language, Nullish, Role } from '@3dp4me/types';

const getAttr = (user: Nullish<CognitoIdentityServiceProvider.UserType>, atr: string) => {
    return user?.Attributes?.find((attribute) => attribute.Name === atr)?.Value;
};

export const getAccessLevel = (user: Nullish<CognitoIdentityServiceProvider.UserType>): AccessLevel => {
    return (getAttr(user, COGNITO_ATTRIBUTES.ACCESS) as AccessLevel) || AccessLevel.PENDING;
};

export const getName = (user: Nullish<CognitoIdentityServiceProvider.UserType>) => {
    return getAttr(user, 'name') || getUsername(user);
};

export const getEmail = (user: Nullish<CognitoIdentityServiceProvider.UserType>) => {
    return getAttr(user, 'email') || getUsername(user);
};

export const getUsername = (user: Nullish<CognitoIdentityServiceProvider.UserType>) => {
    return user?.Username || "Anonymous User";
};

export const getId = (user: Nullish<CognitoIdentityServiceProvider.UserType>) => {
    return user?.Username;
};

export const getRolesValue = (user: Nullish<CognitoIdentityServiceProvider.UserType>): string[] => {
    const info = getAttr(user, COGNITO_ATTRIBUTES.ROLES);
    return info ? JSON.parse(info) : [];
};

export const getRoles = (user: Nullish<CognitoIdentityServiceProvider.UserType>, allRolesData: Role[], selectedLang: Language) => {
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
