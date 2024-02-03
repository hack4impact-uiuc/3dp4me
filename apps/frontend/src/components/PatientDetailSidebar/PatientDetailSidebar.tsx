import './PatientDetailSidebar.scss'

import { Nullish, Patient, Step } from '@3dp4me/types'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    createTheme,
    ThemeProvider,
} from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useEffect, useState } from 'react'

import { useTranslations } from '../../hooks/useTranslations'
import { LANGUAGES } from '../../utils/constants'
import { hasNotesForStep } from '../../utils/metadataUtils'
import { getPatientName } from '../../utils/utils'
import PhotoField from '../Fields/PhotoField'
import { getProfilePictureUrl } from '../../utils/profilePicture'

const arTheme = createTheme({
    direction: 'rtl',
})

const enTheme = createTheme({
    direction: 'ltr',
})

export interface PatientDetailSidebarProps<T extends Patient = Patient> {
    stepMetaData: Step[]
    patientData: T
    onViewPatient: () => void
}

const PatientDetailSidebar = ({
    stepMetaData,
    patientData,
    onViewPatient,
}: PatientDetailSidebarProps) => {
    const [expandedStepKey, setExpandedStepKey] = useState<Nullish<string>>(null)
    const [translations, selectedLang] = useTranslations()
    const [profilePicUrl, setProfilePicUrl] = useState<Nullish<string>>(null)

    /**
     * Expands the notes panel for the given step, or closes all panels
     */
    const expandNotePanel = (stepKey: string) => (_: unknown, isExpanded: boolean) => {
        setExpandedStepKey(isExpanded ? stepKey : null)
    }

    useEffect(() => {
        const updateProfilePic = async () => {
            const url = await getProfilePictureUrl(stepMetaData, patientData)
            setProfilePicUrl(url)
        }

        updateProfilePic()
    }, [stepMetaData, patientData])

    /**
     * Generates the sidebar with notes for each step. We make the field with key, 'notes', a special reserved
     * field that should only be used for notes. So we go through each step, looking for a field with
     * a key of notes. If one exists, we add it to the sidebar.
     */
    const generateNoteSidebar = () => {
        if (stepMetaData == null) return null
        if (patientData == null) return null

        return (
            <div className="drawer-notes-wrapper">
                {stepMetaData.map((metaData) => {
                    // First, check that we have a field in this step with key, 'notes'
                    const notesField = metaData.fields.find((f) => f.key === 'notes')
                    if (!notesField) return null

                    // Check that we actually have data for this patient in the notes field
                    if (!hasNotesForStep(patientData, metaData)) return null

                    return (
                        <Accordion
                            key={`notes-${metaData?.key}`}
                            expanded={expandedStepKey === metaData.key}
                            onChange={expandNotePanel(metaData.key)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon className="expand-icon" />}
                            >
                                {metaData.displayName[selectedLang]}
                            </AccordionSummary>
                            <AccordionDetails>{patientData[metaData.key].notes}</AccordionDetails>
                        </Accordion>
                    )
                })}
            </div>
        )
    }

    return (
        <ThemeProvider theme={selectedLang === LANGUAGES.AR ? arTheme : enTheme}>
            <Drawer
                className={selectedLang === LANGUAGES.EN ? 'drawer' : 'drawer-rtl'}
                variant="permanent"
                classes={{
                    paper: 'drawer-paper',
                }}
            >
                <Toolbar />
                <div className="drawer-container">
                    <div>
                        { profilePicUrl && <img id="profile-pic" src={profilePicUrl} />}
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">
                                {translations.components.sidebar.name}
                            </span>{' '}
                            <br />
                            <span className="drawer-text">{getPatientName(patientData)}</span>
                        </div>
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">
                                {translations.components.sidebar.orderID}
                            </span>{' '}
                            <br />
                            <span className="drawer-text">{patientData?.orderId}</span>
                        </div>
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">
                                {translations.components.sidebar.status}
                            </span>{' '}
                            <br />
                            <span className="drawer-text">{patientData?.status}</span>
                        </div>
                        <span className="drawer-text-label">
                            {translations.components.notes.title}
                        </span>
                        {generateNoteSidebar()}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button onClick={onViewPatient} className="manage-patient-button">
                            {translations.components.button.managePatient}
                        </Button>
                    </div>
                </div>
            </Drawer>
        </ThemeProvider>
    )
}

export default PatientDetailSidebar
