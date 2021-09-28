import React, { useState, useContext } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logo from '../../assets/3dp4me_logo.png';
import AccountDropdown from '../AccountDropdown/AccountDropdown';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES, ROUTES } from '../../utils/constants';

import './Navbar.scss';
import { Context } from '../../store/Store';

import { useStyles } from './Navbar.style';

const Navbar = ({ username, userEmail }) => {
    const state = useContext(Context)[0];
    const classes = useStyles();
    const [translations, selectedLang] = useTranslations();
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
        //Replaced activeRoute with window.location.pathname since activeRoute defaults to '/' on page reload
        const activeClass = window.location.pathname === route ? 'active' : '';

        return (
            <Link
                key={route}
                className={`nav-item ${activeClass}`}
                onClick={() => setActiveRoute(route)}
                to={`${route}`}
            >
                {text}
            </Link>
        );
    };

    const renderLinks = () => {
        let links = [
            renderLink(navTranslations.dashboard.navTitle, ROUTES.DASHBOARD),
            renderLink(navTranslations.patients.navTitle, ROUTES.PATIENTS),
        ];

        // If the user is admin, they can use account/dashboard management
        if (state.isAdmin) {
            links = links.concat([
                renderLink(
                    navTranslations.accountManagement.navTitle,
                    ROUTES.ACCOUNT,
                ),
                renderLink(
                    navTranslations.dashboardManagement.navTitle,
                    ROUTES.DASHBOARD_MANAGEMENT,
                ),
            ]);
        }

        return links;
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

                    {renderLinks()}

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
