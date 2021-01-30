import React, { useEffect, useState } from 'react';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';
import BottomBar from '../../components/BottomBar/BottomBar';
import './Delivery.scss';
import { updateStage } from '../../utils/api';

const Delivery = ({
    information,
    status,
    address,
    deliveryType,
    languageData,
    id,
    updatePatientFile,
}) => {
    const [info, setInfo] = useState(information);
    const stageName = 'deliveryInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        // setAddress(info.address);
        setDeliveryStatus(info.deliveryStatus);
    }, [trigger, info.deliveryStatus]);

    const saveData = () => {
        const infoCopy = info;
        infoCopy.deliveryStatus = deliveryStatus;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.delivery, '', 'success');
    };

    const discardData = () => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                lang.components.button.discard.cancelButton,
                lang.components.button.discard.confirmButton,
            ],
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: lang.components.button.discard.success,
                    icon: 'success',
                    buttons: lang.components.button.discard.confirmButton,
                });
                reset(!trigger);
                setEdit(false);
            }
        });
    };

    return (
        <div className="delivery-wrapper">
            <h1>{lang.patientView.delivery.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <h3>{lang.patientView.delivery.address}</h3>
            {/* <TextField
                disabled={!edit}
                className={edit ? "active-input" : "input-field"}
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            /> */}
            <p>{address}</p>
            <div className="delivery-address-label">
                {lang.patientView.delivery.addressLabel + deliveryType}
            </div>
            <h3>{lang.patientView.delivery.status}</h3>
            <FormControl disabled={!edit} component="fieldset">
                <RadioGroup
                    name="status"
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                >
                    <FormControlLabel
                        value="notReady"
                        control={<Radio />}
                        label={lang.patientView.delivery.notReady}
                    />
                    <FormControlLabel
                        value="ready"
                        control={<Radio />}
                        label={lang.patientView.delivery.ready}
                    />
                    <FormControlLabel
                        value="out"
                        control={<Radio />}
                        label={lang.patientView.delivery.out}
                    />
                    <FormControlLabel
                        value="handDelivered"
                        control={<Radio />}
                        label={lang.patientView.delivery.handDelivered}
                    />
                    <FormControlLabel
                        value="pickup"
                        control={<Radio />}
                        label={lang.patientView.delivery.pickup}
                    />
                </RadioGroup>
            </FormControl>
            <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={status}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        </div>
    );
};

Delivery.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    deliveryType: PropTypes.string.isRequired,
};

export default Delivery;
