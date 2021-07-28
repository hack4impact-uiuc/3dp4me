import React, { useState } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logo from '../../assets/3dp4me_logo.png';
import AccountDropdown from '../AccountDropdown/AccountDropdown';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';
import './Navbar.scss';
import { useStyles } from './Navbar.style';

const ROUTES = {
    DASHBOARD: '/',
    PATIENTS: '/patients',
    METRICS: '/metrics',
    ACCOUNT: '/account',
};

const Navbar = ({ username, userEmail }) => {
    const [translations, selectedLang] = useTranslations();
    const classes = useStyles();
    const [activeRoute, setActiveRoute] = useState(ROUTES.DASHBOARD);
    const [anchorEl, setAnchorEl] = useState(null);
    const navTranslations = translations.components.navbar;

    const handleAccountClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleAccountClose = () => {
        setAnchorEl(null);
    };

    const renderLink = (text, route) => {
        const activeClass = activeRoute === route ? 'active' : '';

        return (
            <Link
                className={`nav-item ${activeClass}`}
                onClick={() => setActiveRoute(route)}
                to={`${route}`}
            >
                {text}
            </Link>
        );
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
                        onClick={() => setActiveRoute(ROUTES.DASHBOARD)}
                        id="nav-title"
                        className={`${classes.navTitle} nav-item`}
                        to={ROUTES.DASHBOARD}
                    >
                        {translations.components.navbar.dashboard.navTitle}
                    </Link>
                    {renderLink(
                        navTranslations.dashboard.navTitle,
                        ROUTES.DASHBOARD,
                    )}
                    {renderLink(
                        navTranslations.patients.navTitle,
                        ROUTES.PATIENTS,
                    )}
                    {renderLink(
                        navTranslations.metrics.navTitle,
                        ROUTES.METRICS,
                    )}
                    {renderLink(
                        navTranslations.accountManagement.navTitle,
                        ROUTES.ACCOUNT,
                    )}
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
    username: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
};

export default Navbar;
