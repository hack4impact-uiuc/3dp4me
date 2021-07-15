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
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';

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

const Navbar = ({ username, userEmail }) => {
    const [translations, selectedLang] = useTranslations();
    const classes = useStyles();
    const [active, setActive] = useState('dashboard');
    const [anchorEl, setAnchorEl] = useState(null);

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
                        className={
                            selectedLang === LANGUAGES.AR ? 'logo-ar' : ''
                        }
                        height={32}
                        src={Logo}
                    />

                    <Link
                        onClick={() => setActive('dashboard')}
                        id="nav-title"
                        className={`${classes.navTitle} nav-item`}
                        to="/"
                    >
                        {translations.components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'dashboard' ? 'active' : ''
                        }`}
                        onClick={() => setActive('dashboard')}
                        to="/"
                    >
                        {translations.components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'patients' ? 'active' : ''
                        }`}
                        onClick={() => setActive('patients')}
                        to="/patients"
                    >
                        {translations.components.navbar.patients.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'metrics' ? 'active' : ''
                        }`}
                        onClick={() => setActive('metrics')}
                        to="/metrics"
                    >
                        {translations.components.navbar.metrics.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'account' ? 'active' : ''
                        }`}
                        onClick={() => setActive('account')}
                        to="/account"
                    >
                        {
                            translations.components.navbar.accountManagement
                                .navTitle
                        }
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
    username: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
};

export default Navbar;
