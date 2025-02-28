import './Sidebar.scss'

import { Step } from '@3dp4me/types'
import { styled } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'

import { useTranslations } from '../../hooks/useTranslations'
import { LANGUAGES } from '../../utils/constants'

const StyledDrawer = styled(Drawer)({
    background: '#dddef2',
})

export interface SidebarProps {
    onClick: (key: string) => void
    onAddStep: () => void
    onEditStep: (key: string) => void
    stepMetadata: Step[]
    onDownPressed: (key: string) => void
    onUpPressed: (key: string) => void
    isEditing: boolean
    selectedStep: string
}

const Sidebar = ({
    onClick,
    onAddStep,
    onEditStep,
    stepMetadata,
    onDownPressed,
    onUpPressed,
    isEditing,
    selectedStep,
}: SidebarProps) => {
    const selectedLang = useTranslations()[1]

    function onButtonClick(stepKey: string) {
        onClick(stepKey)
    }

    const generateBottomButton = () => {
        if (!isEditing) return null

        return (
            <Button className="edit-steps-button" onClick={onAddStep}>
                Add Step
            </Button>
        )
    }

    const generateReorderButtons = (stepKey: string, className: string) => {
        if (!isEditing) return null

        return [
            <div className={`button order-button ${className}`} onClick={() => onEditStep(stepKey)}>
                <i className="pencil alternate icon" />
            </div>,
            <div
                className={`button order-button ${className}`}
                onClick={() => onDownPressed(stepKey)}
            >
                <i className="chevron down icon" />
            </div>,
            <div
                className={`button order-button ${className}`}
                onClick={() => onUpPressed(stepKey)}
            >
                <i className="chevron up icon" />
            </div>,
        ]
    }

    const getButtonClassname = (stepKey: string, isHidden: boolean) => {
        let buttonClassNameByLanguage =
            selectedLang === LANGUAGES.AR ? 'main-button-ar' : 'main-button'
        if (selectedStep === stepKey) {
            buttonClassNameByLanguage += ' selected'
        } else {
            buttonClassNameByLanguage += isHidden ? ' hidden' : ' unselected'
        }
        return buttonClassNameByLanguage
    }

    const generateButtons = () =>
        stepMetadata.map((element) => {
            // Don't render deleted steps
            if (element.isDeleted) {
                return null
            }

            const buttonClassName = getButtonClassname(element.key, element.isHidden || false)

            return (
                <div className="sidebar-button-container">
                    <div
                        className={`button ${buttonClassName}`}
                        onClick={() => onButtonClick(element.key)}
                    >
                        {element.displayName[selectedLang]}
                    </div>
                    {generateReorderButtons(element.key, buttonClassName)}
                </div>
            )
        })

    return (
        <StyledDrawer
            className={`sidebar ${isEditing ? 'sidebar-expanded' : 'sidebar-retracted'}`}
            variant="permanent"
            classes={{ paper: 'detail-paper' }}
        >
            <div className="sidebar-container">{generateButtons()}</div>
            <AppBar
                className={`side-bottom-bar-wrapper ${
                    isEditing ? 'side-bottom-bar-expanded' : 'side-bottom-bar-retracted'
                }`}
                color="inherit"
                style={{
                    top: 'auto',
                    bottom: '0',
                    boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.15)',
                    zIndex: '100',
                }}
            >
                <Toolbar className="side-bottom-bar-toolbar">{generateBottomButton()}</Toolbar>
            </AppBar>
        </StyledDrawer>
    )
}

export default Sidebar
