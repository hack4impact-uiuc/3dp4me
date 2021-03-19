import { FIELD_TYPES } from '../../utils/constants';

const CreateFieldModal = () => {
    const [fieldType, setFieldType] = useState('String');
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const autoId = Math.random().toString(36).substr(2, 24);
    return (
        <Modal open={true}>
            <div
                style={{
                    marginRight: '10px',
                    fontFamily: 'Ubuntu',
                    margin: '0px !important',
                    textAlign: 'left',
                }}
            >
                <h2 style={{ fontWeight: 'bolder' }}>
                    {lang.components.swal.createField.title}
                </h2>
                <h2 style={{ fontWeight: 'normal' }}>
                    {lang.components.swal.createField.title2}
                </h2>
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <span>{lang.components.swal.createField.fieldType}</span>
                    <div style={{ padding: 10 }}>
                        <Select
                            //value={fieldType}
                            onChange={handleFieldTypeSelect}
                            labelId="demo-simple-select-label"
                            MenuProps={{
                                style: { zIndex: 35001 },
                            }}
                            defaultValue={'String'}
                        >
                            <MenuItem value={FIELD_TYPES.STRING}>
                                {FIELD_TYPES.STRING}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.MULTILINE_STRING}>
                                {FIELD_TYPES.MULTILINE_STRING}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.FILE}>
                                {FIELD_TYPES.FILE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.NUMBER}>
                                {FIELD_TYPES.NUMBER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DATE}>
                                {FIELD_TYPES.DATE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.PHONE}>
                                {FIELD_TYPES.PHONE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DIVIDER}>
                                {FIELD_TYPES.DIVIDER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.HEADER}>
                                {FIELD_TYPES.HEADER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.RADIO_BUTTON}>
                                {FIELD_TYPES.RADIO_BUTTON}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DROPDOWN}>
                                {FIELD_TYPES.DROPDOWN}
                            </MenuItem>
                        </Select>
                    </div>
                    <span>{lang.components.swal.createField.clearance}</span>
                    <div style={{ padding: 10 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            MenuProps={{
                                style: { zIndex: 35001 },
                            }}
                            defaultValue={'Confidential'}
                        >
                            <MenuItem value={'Confidential'}>
                                Confidential
                            </MenuItem>
                            <MenuItem value={'Secret'}>Secret</MenuItem>
                            <MenuItem value={'Top Secret'}>Top Secret</MenuItem>
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <Checkbox
                            size="small"
                            fullWidth
                            style={{ padding: 10 }}
                        />
                        <span>
                            {lang.components.swal.createField.showOnDashBoard}
                        </span>
                    </div>
                </div>
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <span>{lang.components.swal.createField.field} </span>
                    <div style={{ fontSize: '12px', textAlign: 'left' }}>
                        <span>{lang.components.swal.createField.arabic} </span>
                    </div>
                    <TextField
                        size="small"
                        id="createDOB"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                    <div style={{ fontSize: '12px', textAlign: 'left' }}>
                        <span>{lang.components.swal.createField.english} </span>
                    </div>
                    <TextField
                        size="small"
                        id="createId"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                </div>
                {generateFields()}
                <div
                    style={{
                        display: 'flex',
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button
                        className={classes.swalEditButton}
                        onClick={() => createPatientHelper(true, autoId)}
                    >
                        {lang.components.swal.createField.buttons.edit}
                    </Button>
                    <Button
                        className={classes.swalCloseButton}
                        onClick={() => createPatientHelper(false, autoId)}
                    >
                        {lang.components.swal.createField.buttons.discard}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
