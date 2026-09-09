import { Language } from '@3dp4me/types'
import {
    fetchAuthSession,
    fetchUserAttributes,
    signOut as amplifySignOut,
    updateUserAttributes,
} from 'aws-amplify/auth'

import { CognitoAttribute } from '../utils/constants'

// Used as a placeholder while fetching real data
const DEFAULT_USER_ATTRIBUTES: Record<string, string | undefined> = {
    email: 'noemail',
    sub: '0',
}

/**
 * Returns some info about the current signed in user
 */
export async function getCurrentUserInfo(): Promise<{
    attributes: Record<string, string | undefined>
}> {
    try {
        const attributes = await fetchUserAttributes()
        return { attributes }
    } catch (error) {
        return { attributes: DEFAULT_USER_ATTRIBUTES }
    }
}

/**
 * Updates a user's language attribute in AWS Cognito User Groups
 * @param {String} langKey The user's preferred language. Either "EN" or "AR".
 */
export async function saveLanguagePreference(langKey: Language) {
    await updateUserAttributes({
        userAttributes: {
            [CognitoAttribute.Language]: langKey,
        },
    })
}

export async function signOut() {
    amplifySignOut()
        // .then()
        .catch((error) => console.error(error))
}

export async function getCurrentSession() {
    return fetchAuthSession()
}
