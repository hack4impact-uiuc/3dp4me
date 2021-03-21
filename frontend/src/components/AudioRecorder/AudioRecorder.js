import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import { Button } from '@material-ui/core';
import MicRecorder from 'mic-recorder-to-mp3';

// const useStyles = makeStyles(() => ({
//     playButton: {
//         backgroundColor: '#5395F8',
//         color: 'white',
//         padding: '0 24px 0 24px',
//         height: '38px',
//         width: 'auto',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         transition: 'all 0.2s',
//         borderRadius: '2px',
//         boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
//         '&:hover': {
//             backgroundColor: '#84b3fa',
//         },
//     },
//     pauseButton: {
//         backgroundColor: 'white',
//         color: 'black',
//         padding: '0 24px 0 24px',
//         height: '38px',
//         width: 'auto',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         marginLeft: '10px',
//         '&:hover': {
//             backgroundColor: '#D3D3D3',
//         },
//     },
// }));

const AudioRecorder = () => {
    // const classes = useStyles();
    const [file, setFile] = useState(null);
    const [player, setPlayer] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const recorder = new MicRecorder({ bitRate: 128 });

    const startRecording = () => {
        recorder.start();
    };

    const stopRecording = () => {
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const file = new File(buffer, 'recording.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                });

                const p = new Audio(URL.createObjectURL(file));

                setPlayer(p);
                setFile(file);
                setModalOpen(true);
            });
    };

    const onModalClose = () => {
        setModalOpen(false);
    };

    const onPlay = () => {
        player.play();
    };

    const onPause = () => {
        player.pause();
    };

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onAfterOpen={() => {}}
                onAfterClose={() => {}}
                onRequestClose={onModalClose}
            >
                <Button onClick={onPlay}>Listen</Button>
                <Button onClick={onPause}>Pause</Button>
            </Modal>

            <Button onClick={startRecording}>Start Recording</Button>
            <Button onClick={stopRecording}>Stop Recording</Button>
        </div>
    );
};

export default AudioRecorder;
