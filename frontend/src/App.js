import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { registerLocale } from 'react-datepicker';
import { enUS, arSA } from 'date-fns/locale';

import Store from './store/Store';
import AppContent from './AppContent';
import Login from './pages/Login/Login';
import { awsconfig } from './aws/aws-exports';
import { LANGUAGES } from './utils/constants';
import { getCurrentUserInfo } from './aws/aws-helper';

import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from './aws/aws-auth';

// Configure amplify
Amplify.configure(awsconfig);

// Configure international date library
registerLocale(LANGUAGES.EN, enUS);
registerLocale(LANGUAGES.AR, arSA);

function App() {
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    /**
     * Attempts to authenticate the user and get their name/email
     */
    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo();
            setUsername(userInfo?.attributes?.name);
            setUserEmail(userInfo?.attributes?.email);
        };

        updateAuthLevel();
        getUserInfo();
    }, []);

    /**
     * Checks if the current user is authenticated and updates the auth
     * level accordingly
     */
    const updateAuthLevel = async () => {
        try {
            await Auth.currentAuthenticatedUser();
            setAuthLevel(AUTHENTICATED);
        } catch (error) {
            setAuthLevel(UNAUTHENTICATED);
        }
    };

    // We get the auth level at startup, then set a listener to get notified when it changes.
    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

    // If we're not sure of the user's status, say we're authenticating
    if (authLevel === UNDEFINED_AUTH) return <p>Authenticating User</p>;

    // If the user is unauthenticated, show login screen
    if (authLevel === UNAUTHENTICATED) return <Login />;

    // If the user is authenticated, show the app
    if (authLevel === AUTHENTICATED)
        return (
            <Store>
                <AppContent username={username} userEmail={userEmail} />
            </Store>
        );

    // This should never get executed
    return <p>Something went wrong</p>;
}

export default App;
