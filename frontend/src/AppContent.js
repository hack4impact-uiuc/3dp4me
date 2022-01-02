import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import ErrorModal from './components/ErrorModal/ErrorModal';
import { useTranslations } from './hooks/useTranslations';
import { Context } from './store/Store';
import {
    LANGUAGES,
    REDUCER_ACTIONS,
} from './utils/constants';
import AllRoutes from './Routes/allRoutes'

const AppContent = () => {
    const [state, dispatch] = useContext(Context);
    const selectedLang = useTranslations()[1];
    const contentClassNames =
        selectedLang === LANGUAGES.AR ? 'flip content' : 'content';

    /**
     * Sets store when the global error modal should be closed
     */
    const handleErrorModalClose = () => {
        dispatch({ type: REDUCER_ACTIONS.CLEAR_ERROR });
    };

    return (
        <div dir={selectedLang === LANGUAGES.AR ? 'rtl' : 'ltr'}>
            <Router>
                <QueryParamProvider ReactRouterRoute={Route}>
                    

                    {/* Global error popup */}
                    <ErrorModal
                        message={state.error}
                        isOpen={state.isErrorVisible}
                        onClose={handleErrorModalClose}
                    />

                    {/* Routes */}
                    <div className={contentClassNames}>
                            <Switch>
                                <AllRoutes />
                            </Switch>
                    </div>
                </QueryParamProvider>
            </Router>
        </div>
    );
};

export default AppContent;
