import MicRecorder from 'mic-recorder-to-mp3';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Modal, Typography } from '@material-ui/core';
import React from 'react';
import './AudioRecorder.scss';

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
            isModalOpen: false,
            isRecording: false,
            isPaused: false,
            blobURL: '',
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
                    blobURL: blobURL,
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
                var getUserMedia =
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
                console.log(err.name + ': ' + err.message);
            });
    };

    componentDidMount() {
        this.checkPermissionForAudio();
    }

    onModalOpen = () => {
        this.setState({
            isModalOpen: true,
        });
    };

    RenderExistingFiles = () => {
        if (this.props.files == null) return null;

        return this.props.files.map((file) => (
            <div className="file-row-wrapper" key={file.fileName}>
                <Button
                    className="file-button"
                    onClick={() => {
                        this.props.handleDownload(this.props.fieldKey, file);
                    }}
                >
                    <div className="file-info-wrapper">
                        <ArrowDownwardIcon />
                        <div>
                            <Typography align="left">
                                {`${file.fileName}`}
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

                <Modal open={this.state.isModalOpen}>
                    <div>
                        <Button
                            onClick={this.toggleRecording}
                            className="mr-3 add-collec-btn"
                        >
                            {isRecording ? 'Stop' : 'Start'}
                        </Button>
                        <audio
                            ref="audioSource"
                            controls="controls"
                            src={this.state.blobURL || ''}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AudioRecorder;
