import React, { useState, useEffect } from 'react';

import { AppBar, Avatar, Toolbar } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Logo from '../../assets/3dp4me_logo.png';
import AccountDropdown from '../AccountDropdown/AccountDropdown';

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

const Navbar = (props) => {
    const classes = useStyles();
    const [active, setActive] = useState('dashboard');
    const [anchorEl, setAnchorEl] = useState(null);
    const lang = props.lang.data;
    const key = props.lang.key;

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
                        {lang[key].components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'dashboard' ? 'active' : ''
                        }`}
                        onClick={() => setActive('dashboard')}
                        to="/"
                    >
                        {lang[key].components.navbar.dashboard.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'patients' ? 'active' : ''
                        }`}
                        onClick={() => setActive('patients')}
                        to="/patients"
                    >
                        {lang[key].components.navbar.patients.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'metrics' ? 'active' : ''
                        }`}
                        onClick={() => setActive('metrics')}
                        to="/metrics"
                    >
                        {lang[key].components.navbar.metrics.navTitle}
                    </Link>
                    <Link
                        className={`nav-item ${
                            active === 'account' ? 'active' : ''
                        }`}
                        onClick={() => setActive('account')}
                        to="/account"
                    >
                        {lang[key].components.navbar.accountManagement.navTitle}
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
                        lang={props.lang}
                        setLang={props.setLang}
                        username={props.username}
                        userEmail={props.userEmail}
                    />
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
