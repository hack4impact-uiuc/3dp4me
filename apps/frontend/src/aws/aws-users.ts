import { AccessLevel, Language, Nullish, TranslatedString } from '@3dp4me/types'
import type { CognitoIdentityServiceProvider } from 'aws-sdk'

import { CognitoAttribute } from '../utils/constants'

const getAttr = (user: Nullish<CognitoIdentityServiceProvider.UserType>, atr: string) =>
    user?.Attributes?.find((attribute) => attribute.Name === atr)?.Value

export const getAccessLevel = (
    user: Nullish<CognitoIdentityServiceProvider.UserType>
): AccessLevel => (getAttr(user, CognitoAttribute.Access) as AccessLevel) || AccessLevel.PENDING

export const getName = (user: Nullish<CognitoIdentityServiceProvider.UserType>) =>
    getAttr(user, 'name') || getUsername(user)

export const getEmail = (user: Nullish<CognitoIdentityServiceProvider.UserType>) =>
    getAttr(user, 'email') || getUsername(user)

export const getUsername = (user: Nullish<CognitoIdentityServiceProvider.UserType>) =>
    user?.Username || 'Anonymous User'

export const getId = (user: Nullish<CognitoIdentityServiceProvider.UserType>) => user?.Username

export const getRolesValue = (user: Nullish<CognitoIdentityServiceProvider.UserType>): string[] => {
    const info = getAttr(user, CognitoAttribute.Roles)
    return info ? JSON.parse(info) : []
}

interface RoleAsOption {
    _id: string
    IsHidden: boolean
    Question: TranslatedString
}

export const getRoles = (
    user: Nullish<CognitoIdentityServiceProvider.UserType>,
    allRolesData: RoleAsOption[],
    selectedLang: Language
) => {
    let roles = getRolesValue(user)
    if (roles.length === 0) return 'Not Assigned'

    roles = roles.map((r) => {
        for (let i = 0; i < allRolesData.length; i++) {
            if (r === allRolesData[i]._id) return allRolesData[i]?.Question[selectedLang]
        }

        return 'Unrecognized role'
    })

    return roles.join(', ')
}
