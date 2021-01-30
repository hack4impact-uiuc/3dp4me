import React from 'react';
import { Auth } from 'aws-amplify';

const Login = () => {
    return (
        <div>
            <button
                type="submit"
                onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
            >
                Sign In
            </button>
        </div>
    );
};

export default Login;
