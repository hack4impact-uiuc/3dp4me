import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import MicRecorder from 'mic-recorder-to-mp3';

const AudioRecorder = () => {
    const [file, setFile] = useState(null);
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

                setFile(file);
                //const player = new Audio(URL.createObjectURL(file));
                //player.play();
            });
    };

    const renderPlayer = () => {
        if (file == null) return null;

        return <ReactAudioPlayer src={'recording.mp3'} controls />;
    };

    return (
        <div>
            <Button onClick={startRecording}>Start Recording</Button>
            <Button onClick={stopRecording}>Stop Recording</Button>
        </div>
    );
};

export default AudioRecorder;
