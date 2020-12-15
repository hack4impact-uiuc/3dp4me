import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

const Login = (props) => {
    return(
        <div>
            <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Sign In</button>
        </div>
    )
}

export default Login
