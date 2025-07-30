import './PatientDetailSidebar.scss'

import { Nullish, Patient } from '@3dp4me/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'

import { useTranslations } from '../../hooks/useTranslations'
import { useSteps } from '../../query/useSteps'
import { LANGUAGES } from '../../utils/constants'
import { hasNotesForStep } from '../../utils/metadataUtils'
import { getPatientName } from '../../utils/utils'
import { ProfilePicture } from '../ProfilePicture/ProfilePicture'

export interface PatientDetailSidebarProps<T extends Patient = Patient> {
    patientData: T
    onViewPatient: () => void
}

const PatientDetailSidebar = ({ patientData, onViewPatient }: PatientDetailSidebarProps) => {
    const { data: stepMetaData } = useSteps({ includeHiddenFields: false })
    const [expandedStepKey, setExpandedStepKey] = useState<Nullish<string>>(null)
    const [translations, selectedLang] = useTranslations()
    const isArabic = selectedLang === LANGUAGES.AR


    /**
     * Expands the notes panel for the given step, or closes all panels
     */
    const expandNotePanel = (stepKey: string) => (_: unknown, isExpanded: boolean) => {
        setExpandedStepKey(isExpanded ? stepKey : null)
    }

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
        <Drawer
            className={selectedLang === LANGUAGES.EN ? 'drawer' : 'drawer-rtl'}
            classes={{paper: 'drawer-paper'}}
            variant="permanent"
            anchor={isArabic ? 'right' : 'left'}       // ← flips automatically
        >
            <Toolbar />
            <div className="drawer-container">
                <div>
                    <ProfilePicture patient={patientData} />
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
                    <span className="drawer-text-label">{translations.components.notes.title}</span>
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
    )
}

export default PatientDetailSidebar
