import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import Logo from '../../assets/3dp4me_logo.png';

import './Patient2FALogin.scss';

const Patient2FALogin = ({ setTokenSent }) => {
    const params = useParams();
    const { patientId } = params;
    const sentToken = false;
        
    return (
        <div className="wrapper login-body">
            <div className="centered">
                <div>
                    <div className="login-header">
                        <img src={Logo} alt="3DP4ME logo" />
                        <h3>Patient Login</h3>
                    </div>

                    <h4>Patient ID:</h4>
                    <p>{patientId}</p>

                    <button
                        className="two-factor-authentication-button"
                        type="submit"
                        onClick ={() => setTokenSent(!sentToken)}
                    >
                        Send Two-Factor Code
                    </button>

                </div>
            </div>
        </div>
    );
};

Patient2FALogin.propTypes = {
    setTokenSent: PropTypes.func,
};

export default Patient2FALogin