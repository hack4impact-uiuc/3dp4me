import { Hub } from 'aws-amplify';

export const AUTHENTICATED = 'AUTH';
export const UNAUTHENTICATED = 'UNAUTH';
export const UNDEFINED_AUTH = 'UNDEFINED';

const EVENT_SIGN_IN = 'signIn';
const EVENT_SIGN_OUT = 'signOut';

type AuthListener = (state: typeof AUTHENTICATED | typeof UNAUTHENTICATED | typeof UNDEFINED_AUTH) => void

/**
 * Sets up a listener that is called every time the authentication level changes
 * @param listener The function to be called when auth changes. Is passed a string indicating auth level.
 */
export const setAuthListener = (listener: AuthListener) => {
    Hub.listen('auth', ({ payload: { event } }) => {
        switch (event) {
            case EVENT_SIGN_IN:
                listener(AUTHENTICATED);
                break;

            case EVENT_SIGN_OUT:
                listener(UNAUTHENTICATED);
                break;

            default:
        }
    });
};
