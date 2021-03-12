import React from 'react';
import { Button } from '@material-ui/core';
import MicRecorder from 'mic-recorder-to-mp3';

const AudioRecorder = () => {
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

                const player = new Audio(URL.createObjectURL(file));
                player.play();
            });
    };

    return (
        <div>
            <Button onClick={startRecording}>Start Recording</Button>
            <Button onClick={stopRecording}>Stop Recording</Button>
        </div>
    );
};

export default AudioRecorder;
