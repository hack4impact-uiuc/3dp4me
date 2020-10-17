import React from 'react';
import { Storage } from 'aws-amplify';

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

async function downloadFile(fileName) {
    Storage.get(fileName, { download: true}).then(
        res => downloadBlob(res.Body, fileName));
}

/**
 * Downloads file from S3 relative to /public directory.
 * @param fileName Full filepath after /pubic. Will be of format patientDir/filename.txt
 */
const S3FileDownload = function(fileName) {
    return (
        <input
            type="button" value='Download'
            onClick={evt => downloadFile(fileName)}
        />
    )
}

export default S3FileDownload;