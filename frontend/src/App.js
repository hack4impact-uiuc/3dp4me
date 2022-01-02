import React from 'react';
import { Amplify } from 'aws-amplify';
import { registerLocale } from 'react-datepicker';
import { enUS, arSA } from 'date-fns/locale';

import Store from './store/Store';
import AppContent from './AppContent';
import { awsconfig } from './aws/aws-exports';
import { LANGUAGES } from './utils/constants';

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
