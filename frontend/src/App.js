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
    return (
        <Store>
            <AppContent />
        </Store>
    );
}

export default App;
