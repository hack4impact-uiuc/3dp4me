import './css/global.css'

import { Language } from '@3dp4me/types'
import { createTheme, StyledEngineProvider, ThemeOptions, ThemeProvider } from '@mui/material'
import React, { Suspense, useContext, useEffect } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { getSelf } from './api/api'
import { getCurrentUserInfo } from './aws/aws-helper'
import ErrorModal from './components/ErrorModal/ErrorModal'
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator'
import { useErrorWrap } from './hooks/useErrorWrap'
import { useTranslations } from './hooks/useTranslations'
import { ReducerActionType } from './store/Reducer'
import { Context } from './store/Store'
import { CognitoAttribute, LANGUAGES, Routes } from './utils/constants'
import { isLanguageValid } from './utils/language'

const Navbar = React.lazy(() => import('./components/Navbar/Navbar'))
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'))
const DashboardManagement = React.lazy(
    () => import('./pages/DashboardManagement/DashboardManagement')
)
const Patient2FA = React.lazy(() => import('./pages/Patient2FALogin/Patient2FALogin'))
const AccountManagement = React.lazy(() => import('./pages/AccountManagement/AccountManagment'))
const PatientDetail = React.lazy(() => import('./pages/PatientDetail/PatientDetail'))
const Patients = React.lazy(() => import('./pages/Patients/Patients'))

interface AppContentProps {
    username: string
    userEmail: string
}

const theme: ThemeOptions = {
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#dedffb',
        },
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
    },
}

const arTheme = createTheme({
    ...theme,
    direction: 'rtl',
})

const enTheme = createTheme({
    ...theme,
    direction: 'ltr',
})

const AppContent = ({ username, userEmail }: AppContentProps) => {
    const errorWrap = useErrorWrap()
    const [state, dispatch] = useContext(Context)
    const selectedLang = useTranslations()[1]
    const contentClassNames = selectedLang === Language.AR ? 'flip content' : 'content'

    /**
     * Gets the user's preferred language and sets it in the store
     * Also checks if the user is an admin and updates store
     */
    useEffect(() => {
        const setLanguage = async () => {
            const userInfo = await getCurrentUserInfo()
            if (!userInfo?.attributes) return

            const language = userInfo.attributes[CognitoAttribute.Language]
            if (isLanguageValid(language)) {
                dispatch({
                    type: ReducerActionType.SET_LANGUAGE,
                    language,
                })
            } else {
                console.error(`Language is invalid: ${language}`)
            }
        }

        const setAdminStatus = async () => {
            const selfRes = await trackPromise(getSelf())
            dispatch({
                type: ReducerActionType.SET_ADMIN_STATUS,
                isAdmin: selfRes?.result?.isAdmin,
            })
        }

        setLanguage()
        errorWrap(setAdminStatus)
    }, [dispatch, errorWrap])

    /**
     * Sets store when the global error modal should be closed
     */
    const handleErrorModalClose = () => {
        dispatch({ type: ReducerActionType.CLEAR_ERROR })
    }

    return (
        <div dir={selectedLang === Language.AR ? 'rtl' : 'ltr'}>
            {/* Shown when making a network request */}
            <LoadingIndicator />
            <Router>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={selectedLang === LANGUAGES.AR ? arTheme : enTheme}>
                            <Suspense fallback={<LoadingIndicator />}>
                                <Navbar username={username} userEmail={userEmail} />

                                {/* Global error popup */}
                                <ErrorModal
                                    message={state.error}
                                    isOpen={!!state.isErrorVisible}
                                    onClose={handleErrorModalClose}
                                />

                                {/* Routes */}
                                <div className={contentClassNames}>
                                    <Switch>
                                        <Route exact path={Routes.DASHBOARD}>
                                            <Dashboard />
                                        </Route>
                                        <Route exact path={Routes.ACCOUNT}>
                                            <AccountManagement />
                                        </Route>
                                        <Route exact path={Routes.PATIENTS}>
                                            <Patients />
                                        </Route>
                                        <Route exact path={Routes.DASHBOARD_MANAGEMENT}>
                                            <DashboardManagement />
                                        </Route>
                                        <Route exact path={`${Routes.PATIENT_2FA}/:patientId`}>
                                            <Patient2FA />
                                        </Route>
                                        <Route exact path={`${Routes.PATIENT_DETAIL}/:patientId`}>
                                            <PatientDetail />
                                        </Route>
                                    </Switch>
                                </div>
                            </Suspense>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </QueryParamProvider>
            </Router>
        </div>
    )
}

export default AppContent
