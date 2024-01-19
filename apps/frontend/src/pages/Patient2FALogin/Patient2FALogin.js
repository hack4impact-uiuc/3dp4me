import React, { useState } from 'react';
import ReactCodeInput from 'react-code-input';
import { useParams } from 'react-router-dom';

import Logo from '../../assets/3dp4me_logo.png';
import { useTranslations } from '../../hooks/useTranslations';

import './Patient2FALogin.scss';
import './TokenInput.scss';

const Patient2FALogin = () => {
    const [isTokenSent, setIsTokenSent] = useState();
    const translations = useTranslations()[0];
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
        width: '0.95em',
        height: '1.5em',
        fontSize: '2.2em',
        boxSizing: 'border-box',
        backgroundColor: '#DEDFFB',
    };

    const displayAuthPage = () => {
        if (!isTokenSent) {
            return (
                <div>
                    <h4 className="sub-header">
                        {translations.patient2FA.patientID}
                    </h4>
                    <h5 className="details">{patientId}</h5>

                    <button
                        className="two-factor-authentication-button"
                        type="submit"
                        onClick={() => setIsTokenSent(true)}
                    >
                        {translations.patient2FA.sendCode}
                    </button>
                </div>
            );
        }

        return (
            <div>
                <h4 className="sub-header">
                    {translations.patient2FA.patientID}
                </h4>
                <h5 className="details">{patientId}</h5>
                <h4 className="sub-header">
                    {translations.patient2FA.twoFactorAuth}
                </h4>
                <h5 className="details">
                    {translations.patient2FA.enterDigits}
                </h5>

                <div className="centered-token-content">
                    <ReactCodeInput fields={6} inputStyle={inputStyle} />

                    <button className="verification-button" type="submit">
                        {translations.patient2FA.verify}
                    </button>
                    <div
                        className="new-token-link"
                        onClick={() => setIsTokenSent(false)}
                    >
                        {translations.patient2FA.resendCode}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="wrapper login-body">
            <div className="centered">
                <div className="login-header">
                    <img src={Logo} alt="3DP4ME logo" />
                    <h3>{translations.patient2FA.patientLogin}</h3>
                </div>
                {displayAuthPage()}
            </div>
        </div>
    );
};

export default Patient2FALogin;
