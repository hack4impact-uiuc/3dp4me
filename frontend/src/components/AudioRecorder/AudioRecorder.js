import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import { Button } from '@material-ui/core';
import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import Record from 'videojs-record/dist/videojs.record.js';
import 'video.js/dist/video-js.min.css';
import 'videojs-record/dist/css/videojs.record.css';

WaveSurfer.microphone = MicrophonePlugin;
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [recordState, setRecordState] = useState(null);

    return (
        <div>
            <audio id="myAudio" class="video-js vjs-default-skin"></audio>
        </div>
    );
};

export default AudioRecorder;
