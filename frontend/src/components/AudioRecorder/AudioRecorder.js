/* eslint-disable */

import MicRecorder from 'mic-recorder-to-mp3';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Modal, Typography } from '@material-ui/core';
import React from 'react';

import './AudioRecorder.scss';
import { downloadBlobWithoutSaving } from '../../utils/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';

/*
 * For whatever reason, this component cannot be written functionally.
 * The MicRecorder object just doesn't work otherwise.
 */

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudioRecorder extends React.Component {
    constructor(props) {
        super(props);
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.state = {
            isPlaybackModalOpen: false,
            isRecordModalOpen: false,
            isRecording: false,
            isPaused: false,
            blobURL: '',
            playbackBlobURL: '',
            isBlocked: false,
            lang: this.props.languageData.translations[
                this.props.languageData.selectedLanguage
            ],
        };
    }

    toggleRecording = () => {
        if (this.state.isRecording) this.stopRecording();
        else this.startRecording();
    };

    startRecording = () => {
        if (this.state.isBlocked) {
            console.log(
                'Please give permission for the microphone to record audio.',
            );
        } else {
            Mp3Recorder.start()
                .then(() => {
                    this.setState({ isRecording: true });
                })
                .catch((e) => console.error(e));
        }
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
            .getUserMedia({ audio: true })
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

    handlePlay = async (file) => {
        const blob = await downloadBlobWithoutSaving(
            this.props.patientId,
            this.props.stepKey,
            this.props.fieldKey,
            file.filename,
        );
        const blobURL = URL.createObjectURL(blob);
        this.setState({
            isPlaybackModalOpen: true,
            playbackBlobURL: blobURL,
        });
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
                <button
                    className="file-close-button"
                    type="button"
                    onClick={() =>
                        this.props.handleDelete(this.props.fieldKey, file)
                    }
                >
                    <CloseIcon />
                </button>
            </div>
        ));
    };

    saveRecording = () => {
        fetch(this.state.blobURL)
            .then((r) => r.blob())
            .then((blob) => {
                const file_name = `${
                    this.props.fieldKey
                }_${Math.random().toString(36).substring(6)}.mp3`;
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
                        <label
                            htmlFor={`upload-file-input-${this.props.title}`}
                        >
                            <input
                                id={`upload-file-input-${this.props.title}`}
                                className="upload-file-input"
                                type="button"
                                onClick={this.onModalOpen}
                                onChange={(e) => {
                                    this.props.handleUpload(
                                        this.props.fieldKey,
                                        e.target.files[0],
                                    );
                                }}
                            />
                            <Button className="file-button" component="span">
                                <AddIcon />
                                <Typography align="left">
                                    <b>
                                        {
                                            this.state.lang.components.audio
                                                .addAnother
                                        }
                                    </b>
                                </Typography>
                            </Button>
                        </label>
                    </div>
                </div>

                <Modal
                    open={this.state.isRecordModalOpen}
                    className="record-modal"
                >
                    <div>
                        <audio
                            ref="audioSource"
                            controls="controls"
                            src={this.state.blobURL || ''}
                        />
                        <Button
                            onClick={this.toggleRecording}
                            className="btn-toggle-record"
                        >
                            {isRecording
                                ? this.state.lang.components.audio.stop
                                : this.state.lang.components.audio.start}
                        </Button>
                        {isRecording || this.state.blobURL === '' || (
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
                </Modal>
                <Modal
                    open={this.state.isPlaybackModalOpen}
                    onClose={this.closePlaybackModal}
                    className="playback-modal"
                >
                    <div>
                        <audio
                            ref="audioSource"
                            controls="controls"
                            src={this.state.playbackBlobURL || ''}
                        />
                        <Button
                            onClick={this.closePlaybackModal}
                            className="btn-close-playback"
                        >
                            {this.state.lang.components.audio.close}
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AudioRecorder;
