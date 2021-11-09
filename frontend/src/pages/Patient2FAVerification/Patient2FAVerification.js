import React from 'react';
import { useParams } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';

import Logo from '../../assets/3dp4me_logo.png';

import './Patient2FAVerification.scss';
import './TokenInput.scss';

const Patient2FALogin = () => {
    const params = useParams();
    const { patientId } = params;

    const inputStyle = {
        fontFamily: 'monospace',
        MozAppearance: 'textfield',
        borderRadius: '2px',
        border: '0px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
        margin: '4px',
        paddingLeft: '6px',
        paddingRight: 0,
        width: '30px',
        height: '45px',
        fontSize: '32px',
        boxSizing: 'border-box',
        backgroundColor: '#DEDFFB',
    };

    return (
        <div className="wrapper login-body">
            <div className="centered">
                <div className="inner">
                    <div className="login-header">
                        <img src={Logo} alt="3DP4ME logo" />
                        <h3>Patient Login</h3>
                    </div>

                    <h4>Patient ID:</h4>
                    <h5>{patientId}</h5>
                    <h4>Two Factor Authentication:</h4>
                    <h5>Enter 6-Digit Code from ****</h5>

                    <div className="centered-token-content">
                        <ReactCodeInput fields={6} inputStyle={inputStyle} />

                        <button className="verification-button" type="submit">
                            Verify
                        </button>
                        <p>Send code again</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patient2FALogin;
