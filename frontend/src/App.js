import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { registerLocale } from 'react-datepicker';
import { enUS, arSA } from 'date-fns/locale';

import Store from './store/Store';
import AppContent from './AppContent';
import { awsconfig } from './aws/aws-exports';
import { LANGUAGES } from './utils/constants';
import Login from './components/Login/Login';
import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from './aws/aws-auth';
import { getCurrentUserInfo } from './aws/aws-helper';

Amplify.configure(awsconfig);
registerLocale(LANGUAGES.EN, enUS);
registerLocale(LANGUAGES.AR, arSA);

function App() {
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo();
            setUsername(userInfo?.attributes?.name);
            setUserEmail(userInfo?.attributes?.email);
        };

        updateAuthLevel();
        getUserInfo();
    }, []);

    const updateAuthLevel = () => {
        Auth.currentAuthenticatedUser()
            .then(() => {
                setAuthLevel(AUTHENTICATED);
            })
            .catch(() => {
                setAuthLevel(UNAUTHENTICATED);
            });
    };

    // We get the auth level at startup, then set a listener to get notified when it changes.
    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

    if (authLevel === UNDEFINED_AUTH) return <p>Authenticating User</p>;

    if (authLevel === UNAUTHENTICATED) return <Login />;

    if (authLevel === AUTHENTICATED)
        return (
            <Store>
                <AppContent username={username} userEmail={userEmail} />
            </Store>
        );
}

export default App;
