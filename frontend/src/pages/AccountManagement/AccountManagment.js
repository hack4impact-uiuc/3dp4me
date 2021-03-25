import React from 'react';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';

const AccountManagement = ({ languageData }) => {
    return (
        <div className="dashboard">
            <AudioRecorder
                languageData={languageData}
                title="Audio Recording"
            />
        </div>
    );
};

export default AccountManagement;
