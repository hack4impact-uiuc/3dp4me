import './Login.scss'

import { Auth } from 'aws-amplify'
import React from 'react'

import Logo from '../../assets/3dp4me_logo.png'
import GoogleLogo from '../../assets/google_logo.svg'

/**
 * Page for users to log in with Google
 */
const Login = () => (
    <div className="wrapper login-body">
        <div className="centered">
            <div className="inner">
                <div className="login-header">
                    <img src={Logo} alt="3DP4ME logo" />
                    <h3>Dashboard Login</h3>
                </div>
                <button
                    className="google-button"
                    type="submit"
                    onClick={() =>
                        Auth.federatedSignIn({
                            provider: 'Google' as any,
                        })
                    }
                >
                    <img src={GoogleLogo} alt="Google logo" />
                    Sign in with Google
                </button>
            </div>
        </div>
    </div>
)

export default Login
