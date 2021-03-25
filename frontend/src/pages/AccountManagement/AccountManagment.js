import React from 'react';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';

const AccountManagement = ({ languageData }) => {
    return (
        <div className="dashboard">
            <AudioRecorder
                languageData={languageData}
                handleUpload={(n, f) => {
                    console.log(f);
                }}
                title="Audio Recording"
                fieldKey="voicememo"
            />
        </div>
    );
};

export default AccountManagement;
