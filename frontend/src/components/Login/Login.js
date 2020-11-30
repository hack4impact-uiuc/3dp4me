import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

const Login = () => {
    return(
        <div>
            <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
        </div>
    )
}

export default Login
