import './Navbar.scss'

import { Language, Nullish } from '@3dp4me/types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PropTypes from 'prop-types'
import React, { MouseEventHandler, useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../assets/3dp4me_logo.png'
import { useTranslations } from '../../hooks/useTranslations'
import { Context } from '../../store/Store'
import { Routes } from '../../utils/constants'
import AccountDropdown from '../AccountDropdown/AccountDropdown'
import { useStyles } from './Navbar.style'

export interface NavbarProps {
    username: string
    userEmail: string
}

const Navbar = ({ username, userEmail }: NavbarProps) => {
    const state = useContext(Context)[0]
    const classes = useStyles()
    const [translations, selectedLang] = useTranslations()
    const [activeRoute, setActiveRoute] = useState(window.location.pathname)
    const [anchorEl, setAnchorEl] = useState<Nullish<EventTarget & SVGSVGElement>>(null)
    const navTranslations = translations.components.navbar

    const handleAccountClick: MouseEventHandler<SVGSVGElement> = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleAccountClose = () => {
        setAnchorEl(null)
    }

    const renderLink = (text: string, route: Routes) => {
        // Replaced activeRoute with window.location.pathname since activeRoute defaults to '/' on page reload
        const activeClass = activeRoute === route ? 'active' : ''

        return (
            <Link
                key={route}
                className={`nav-item ${activeClass}`}
                onClick={() => setActiveRoute(route)}
                to={`${route}`}
            >
                {text}
            </Link>
        )
    }

    const renderLinks = () => {
        let links = [
            renderLink(navTranslations.dashboard.navTitle, Routes.DASHBOARD),
            renderLink(navTranslations.patients.navTitle, Routes.PATIENTS),
        ]

        // If the user is admin, they can use account/dashboard management
        if (state.isAdmin) {
            links = links.concat([
                renderLink(navTranslations.accountManagement.navTitle, Routes.ACCOUNT),
                renderLink(
                    navTranslations.dashboardManagement.navTitle,
                    Routes.DASHBOARD_MANAGEMENT
                ),
            ])
        }

        return links
    }

    return (
        <div className="wrap-nav">
            <AppBar className={classes.appBar}>
                <Toolbar className={`navbar ${classes.toolBar}`}>
                    <img
                        alt="Logo"
                        className={selectedLang === Language.AR ? 'logo-ar' : ''}
                        height={32}
                        src={Logo}
                    />

                    <Link
                        onClick={() => setActiveRoute(Routes.DASHBOARD)}
                        id="nav-title"
                        className={`${classes.navTitle} nav-item`}
                        to={Routes.DASHBOARD}
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
    )
}

Navbar.propTypes = {
    username: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
}

export default Navbar
