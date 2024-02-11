import 'react-loading-skeleton/dist/skeleton.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Amplify, Auth } from 'aws-amplify'
import { arSA, enUS } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { registerLocale } from 'react-datepicker'

import AppContent from './AppContent'
import { AUTHENTICATED, setAuthListener, UNAUTHENTICATED, UNDEFINED_AUTH } from './aws/aws-auth'
import { awsconfig } from './aws/aws-exports'
import { getCurrentUserInfo } from './aws/aws-helper'
import Login from './pages/Login/Login'
import { queryClient } from './query/query'
import Store from './store/Store'
import { LANGUAGES } from './utils/constants'

// Configure amplify
Amplify.configure(awsconfig)

// Configure international date library
registerLocale(LANGUAGES.EN, enUS)
registerLocale(LANGUAGES.AR, arSA)

function App() {
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH)
    const [username, setUsername] = useState('')
    const [userEmail, setUserEmail] = useState('')

    /**
     * Attempts to authenticate the user and get their name/email
     */
    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo()
            setUsername(userInfo?.attributes?.name)
            setUserEmail(userInfo?.attributes?.email)
        }

        updateAuthLevel()
        getUserInfo()
    }, [])

    /**
     * Checks if the current user is authenticated and updates the auth
     * level accordingly
     */
    const updateAuthLevel = async () => {
        try {
            await Auth.currentAuthenticatedUser()
            setAuthLevel(AUTHENTICATED)
        } catch (error) {
            setAuthLevel(UNAUTHENTICATED)
        }
    }

    // We get the auth level at startup, then set a listener to get notified when it changes.
    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel))

    // If we're not sure of the user's status, say we're authenticating
    if (authLevel === UNDEFINED_AUTH) return <p>Authenticating User</p>

    // If the user is unauthenticated, show login screen
    if (authLevel === UNAUTHENTICATED) return <Login />

    // If the user is authenticated, show the app
    if (authLevel === AUTHENTICATED)
        return (
            <QueryClientProvider client={queryClient}>
                <Store>
                    <AppContent username={username} userEmail={userEmail} />
                </Store>
            </QueryClientProvider>
        )

    // This should never get executed
    return <p>Something went wrong</p>
}

export default App
