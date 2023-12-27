/* eslint-disable */

import translations from '../../translations.json';
import MicRecorder from 'mic-recorder-to-mp3';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Modal, Typography } from '@material-ui/core';
import React from 'react';
import './AudioRecorder.scss';
import { downloadBlobWithoutSaving } from '../../api/api';
import AudioRecordImg from '../../assets/microphone.svg';
import { trackPromise } from 'react-promise-tracker';
import { LANGUAGES } from '../../utils/constants';
import promptInstructionsAR from '../../assets/audio-prompt-instructions-ar.gif';
import promptInstructionsEN from '../../assets/audio-prompt-instructions-en.gif';
import {
    PERMISSION_CONSTRAINTS,
    PERMISSION_STATUS_DENIED,
} from '../../utils/constants';
import swal from 'sweetalert';
import { File as FileType, Language } from '@3dp4me/types';
/*
 * For whatever reason, this component cannot be written functionally.
 * The MicRecorder object just doesn't work otherwise.
 */

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

interface AudioRecorderProps {
    selectedLanguage: Language
    fieldKey: string
    stepKey: string
    files: FileType[]
    isDisabled: boolean
    title: string
    patientId: string
    handleUpload: (key: string, file: File) => void
    handleDelete: (key: string, file: File) => void
}

class AudioRecorder extends React.Component<AudioRecorderProps> {
    constructor(props: AudioRecorderProps) {
        super(props);
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.setIsBlocked = this.setIsBlocked.bind(this);

        this.state = {
            isPlaybackModalOpen: false,
            isRecordModalOpen: false,
            isRecording: false,
            isPaused: false,
            blobURL: '',
            playbackBlobURL: '',
            isBlocked: true,
            lang: translations[this.props.selectedLanguage],
        };
    }

    componentWillMount() {
        const updatePermissionStatus = async () => {
            this.getMedia({ PERMISSION_CONSTRAINTS });
            if (navigator.permissions && navigator.permissions.query) {
                const permissionStatus = await navigator.permissions.query({
                    name: 'microphone',
                });
                this.setPermissionListener(permissionStatus, this.setIsBlocked);
            }
        };
        updatePermissionStatus();
    }

    getMedia = async (constraints: MediaStreamConstraints) => {
        try {
            this.setState({ isBlocked: false });
            await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            this.setState({ isBlocked: true });
        }
    };

    setIsBlocked = (val: boolean) => {
        this.setState({ isBlocked: val });
    };

    setPermissionListener = (permissionStatus: PermissionStatus, setIsBlocked: (v: boolean) => void) => {
        permissionStatus.onchange = function () {
            if (this.state === PERMISSION_STATUS_DENIED) {
                setIsBlocked(true);
            } else {
                setIsBlocked(false);
            }
        };
    };

    generateMicrophone = () => {
        if (this.state.isBlocked) {
            return (
                <>
                    <h1>
                        {
                            this.state.lang.components.microphone
                                .promptInstructions
                        }
                    </h1>
                    <img
                        src={
                            this.props.selectedLanguage === Language.EN
                                ? promptInstructionsEN
                                : promptInstructionsAR
                        }
                        alt="instructions"
                    />
                    <div className="bottom-butts">
                        <Button
                            onClick={this.discardRecording}
                            className="btn-discard-recording"
                        >
                            {this.state.lang.components.audio.close}
                        </Button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <audio
                        ref="audioSource"
                        controls="controls"
                        src={this.state.blobURL || ''}
                    />
                    <Button
                        onClick={this.toggleRecording}
                        className="btn-toggle-record"
                    >
                        <img src={AudioRecordImg} alt="Microphone icon" />
                        {this.state.isRecording
                            ? this.state.lang.components.audio.stop
                            : this.state.lang.components.audio.start}
                    </Button>
                    <div className="bottom-butts">
                        {this.state.isRecording || this.state.blobURL === '' || (
                            <Button
                                onClick={this.saveRecording}
                                className="btn-save-recording"
                            >
                                {this.state.lang.components.audio.save}
                            </Button>
                        )}
                        <Button
                            onClick={this.discardRecording}
                            className="btn-discard-recording"
                        >
                            {this.state.lang.components.audio.discard}
                        </Button>
                    </div>
                </>
            );
        }
    };

    toggleRecording = () => {
        if (this.state.isRecording) this.stopRecording();
        else this.startRecording();
    };

    startRecording = () => {
        Mp3Recorder.start()
            .then(() => {
                this.setState({ isRecording: true });
            })
            .catch((e) => console.error(e));
    };

    stopRecording = () => {
        this.setState({ isRecording: false });
        Mp3Recorder.stop()
            .getMp3()
            .then(async ([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob);
                this.setState({
                    blobURL,
                    isRecording: false,
                });
            })
            .catch((e) => console.log(e));
    };

    checkPermissionForAudio = () => {
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                // First get ahold of the legacy getUserMedia, if present
                const getUserMedia =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error(
                            'getUserMedia is not implemented in this browser',
                        ),
                    );
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        navigator.mediaDevices
            .getUserMedia(PERMISSION_CONSTRAINTS)
            .then((stream) => {
                this.setState({ isBlocked: false });
            })
            .catch((err) => {
                this.setState({ isBlocked: true });
                console.log(
                    'Please give permission for the microphone to record audio.',
                );
                console.log(`${err.name}: ${err.message}`);
            });
    };

    componentDidMount() {
        this.checkPermissionForAudio();
    }

    onModalOpen = () => {
        this.setState({
            isRecordModalOpen: true,
        });
    };

    closePlaybackModal = () => {
        this.setState({
            isPlaybackModalOpen: false,
        });
    };

    discardRecording = () => {
        if (this.state.isRecording) this.stopRecording();

        this.setState({
            isRecordModalOpen: false,
            isRecording: false,
        });
    };

    handlePlay = async (file: FileType) => {
        const blob = await trackPromise(
            downloadBlobWithoutSaving(
                this.props.patientId,
                this.props.stepKey,
                this.props.fieldKey,
                file.filename,
            ),
        );
        const blobURL = URL.createObjectURL(blob);
        this.setState({
            isPlaybackModalOpen: true,
            playbackBlobURL: blobURL,
        });
    };

    onDeleteFile = (fieldKey: string, file: File) => {
        swal({
            title: this.state.lang.components.audio.deleteTitle,
            text: this.state.lang.components.audio.deleteWarning,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.props.handleDelete(fieldKey, file);
            }
        });
    };

    getDeleteFileButton = (file: File) => {
        if (this.props.isDisabled) return null;

        return (
            <button
                className="file-close-button"
                type="button"
                onClick={() => this.onDeleteFile(this.props.fieldKey, file)}
            >
                <CloseIcon />
            </button>
        );
    };

    RenderExistingFiles = () => {
        if (this.props.files == null) return null;

        return this.props.files.map((file) => (
            <div className="file-row-wrapper" key={file.filename}>
                <Button
                    className="file-button"
                    onClick={() => {
                        this.handlePlay(file);
                    }}
                >
                    <div className="file-info-wrapper">
                        <PlayArrowIcon />
                        <div>
                            <Typography align="left">
                                {`${file.filename}`}
                            </Typography>
                            <p id="file-upload-timestamp">
                                {file.uploadDate.toString()}
                            </p>
                        </div>
                    </div>
                </Button>
                {this.getDeleteFileButton(file)}
            </div>
        ));
    };

    saveRecording = () => {
        fetch(this.state.blobURL)
            .then((r) => r.blob())
            .then((blob) => {
                const file_name = `${this.props.fieldKey}_${Math.random()
                    .toString(36)
                    .substring(6)}.mp3`;
                const file_object = new File([blob], file_name, {
                    type: 'audio/mp3',
                });
                this.props.handleUpload(this.props.fieldKey, file_object);
            });

        if (this.state.isRecording) this.stopRecording();

        this.setState({
            isRecordModalOpen: false,
            isRecording: false,
        });
    };

    getAddAudioButton = () => {
        if (this.props.isDisabled) return null;

        return (
            <label htmlFor={`upload-file-input-${this.props.title}`}>
                <input
                    id={`upload-file-input-${this.props.title}`}
                    className="upload-file-input"
                    type="button"
                    onClick={this.onModalOpen}
                    onChange={(e) => {
                        if (!e.target.files)
                            return

                        this.props.handleUpload(
                            this.props.fieldKey,
                            e.target.files[0],
                        );
                    }}
                />
                <Button className="file-button" component="span">
                    <AddIcon />
                    <Typography align="left">
                        <b>{this.state.lang.components.audio.addAnother}</b>
                    </Typography>
                </Button>
            </label>
        );
    };

    closeRecordModal = () => {
        this.setState({
            isRecordModalOpen: false,
        });
    };

    render() {
        const { isRecording } = this.state;
        return (
            <div>
                <div className="files-wrapper">
                    <div className="files-header">
                        <h3>{this.props.title}</h3>
                    </div>
                    <div className="files-table">
                        {this.RenderExistingFiles()}
                        {this.getAddAudioButton()}
                    </div>
                </div>

                <Modal
                    open={this.state.isRecordModalOpen}
                    onClose={this.closeRecordModal}
                    className="record-modal"
                >
                    <div className="modal-wrap">
                        <div className="modal-inner">
                            {this.generateMicrophone()}
                        </div>
                    </div>
                </Modal>
                <Modal
                    open={this.state.isPlaybackModalOpen}
                    onClose={this.closePlaybackModal}
                    className="playback-modal"
                >
                    <div className="modal-wrap">
                        <div className="modal-inner">
                            <audio
                                ref="audioSource"
                                controls="controls"
                                src={this.state.playbackBlobURL || ''}
                            />
                            <div className="bottom-butts">
                                <Button
                                    onClick={this.closePlaybackModal}
                                    className="btn-close-playback"
                                >
                                    {this.state.lang.components.audio.close}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AudioRecorder;
