import React, { useState } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logo from '../../assets/3dp4me_logo.png';
import AccountDropdown from '../AccountDropdown/AccountDropdown';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './Navbar.scss';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: '0px 0px 4px 0 rgba(0,0,0,0.25)',
    },
    toolBar: {
        minHeight: '48px',
    },
    navTitle: {
        fontWeight: 'bold',
    },
}));

const Navbar = ({ languageData, setSelectedLang, username, userEmail }) => {
    const classes = useStyles();
    const [active, setActive] = useState('dashboard');
    const [anchorEl, setAnchorEl] = useState(null);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleAccountClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleAccountClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="wrap-nav">
            <AppBar className={classes.appBar}>
                <Toolbar className={`navbar ${classes.toolBar}`}>
                    <img
                        alt="Logo"
                        className={key === 'AR' ? 'logo-ar' : ''}
                        height={32}
                        src={Logo}
                    />

                    <Link
                        onClick={() => setActive('dashboard')}
                        id="nav-title"
                        className={`${classes.navTitle} nav-item`}
                        to="/"
                    >
                        {lang.components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'dashboard' ? 'active' : ''
                        }`}
                        onClick={() => setActive('dashboard')}
                        to="/"
                    >
                        {lang.components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'patients' ? 'active' : ''
                        }`}
                        onClick={() => setActive('patients')}
                        to="/patients"
                    >
                        {lang.components.navbar.patients.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'metrics' ? 'active' : ''
                        }`}
                        onClick={() => setActive('metrics')}
                        to="/metrics"
                    >
                        {lang.components.navbar.metrics.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'account' ? 'active' : ''
                        }`}
                        onClick={() => setActive('account')}
                        to="/account"
                    >
                        {lang.components.navbar.accountManagement.navTitle}
                    </Link>
                    <AccountCircleIcon
                        className="accountCircle"
                        aria-controls="account-dropdown-menu"
                        aria-haspopup="true"
                        onClick={handleAccountClick}
                    />
                    <AccountDropdown
                        anchorEl={anchorEl}
                        handleClose={handleAccountClose}
                        languageData={languageData}
                        setLang={setSelectedLang}
                        username={username}
                        userEmail={userEmail}
                    />
                </Toolbar>
            </AppBar>
        </div>
    );
};

Navbar.propTypes = {
    setSelectedLang: PropTypes.func.isRequired,
    languageData: LanguageDataType.isRequired,
    username: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
};

export default Navbar;
