import { Language, Nullish } from '@3dp4me/types'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { styled } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import React, { MouseEventHandler, useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../assets/3dp4me_logo.png'
import { useTranslations } from '../../hooks/useTranslations'
import { Context } from '../../store/Store'
import { Routes } from '../../utils/constants'
import AccountDropdown from '../AccountDropdown/AccountDropdown'
import ExportButton from '../ExportButton/ExportButton'

export interface NavbarProps {
    username: string
    userEmail: string
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
}))

const StyledToolbar = styled(Toolbar)`
    background-color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 47px;

    .logo-ar {
        margin-left: 15px;
    }

    #nav-title {
        flex-grow: 1;
        margin: 0 10px 0 10px;
        font-size: 14px;
        color: black;
    }

    .active {
        font-weight: bolder;
        color: black;
    }

    .accountCircle {
        fill: black;
        font-size: 30px;
        margin: 0 8px;
        opacity: 0.4;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
`

const NavItem = styled(Link)({
    textDecoration: 'none',
    margin: '0 16px 0 16px',
    fontSize: '1rem',
    color: '#5f5f5f',
})

const NavTitle = styled(Link)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1rem',
    textDecoration: 'none',
    margin: '0 16px 0 16px',
    color: '#5f5f5f',
}))

const Navbar = ({ username, userEmail }: NavbarProps) => {
    const state = useContext(Context)[0]
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
            <NavItem
                key={route}
                onClick={() => setActiveRoute(route)}
                className={activeClass}
                to={`${route}`}
            >
                {text}
            </NavItem>
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
        <StyledAppBar variant="elevation" color={'info'} position="sticky">
            <StyledToolbar variant="dense">
                <img
                    alt="Logo"
                    className={selectedLang === Language.AR ? 'logo-ar' : ''}
                    height={36}
                    src={Logo}
                />

                <NavTitle
                    onClick={() => setActiveRoute(Routes.DASHBOARD)}
                    id="nav-title"
                    to={Routes.DASHBOARD}
                >
                    {translations.components.navbar.dashboard.navTitle}
                </NavTitle>

                {renderLinks()}

                <ExportButton
                    buttonText="Export Patient Data"
                    onExportComplete={() => alert('Export successful!')}
                    onExportError={(err) => alert(`Export failed: ${err.message}`)}
                />

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
            </StyledToolbar>
        </StyledAppBar>
    )
}

export default Navbar
