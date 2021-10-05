import { values } from 'lodash';
import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const PhotoField = ({handleFileUpload, value, displayName}) => {

    const dataURItoBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    
    const handleTakePhoto = async (dataUri) => {
        const photoObj = dataURItoBlob(dataUri);
        const d = Date.now();
        const fileName = d.toString();
        const photoFile = new File([photoObj], fileName);
        handleFileUpload('photo', photoFile);
    }


    const images = value.map(v => {return {original: v.uri, thumbnail: v.uri}});

    console.log(images);
    
    //TODO: Delete this boi
//     const ogimages = [
//   {
//     original: 'https://picsum.photos/id/1018/500/300/',
//     thumbnail: 'https://picsum.photos/id/1018/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1015/500/300/',
//     thumbnail: 'https://picsum.photos/id/1015/250/150/',
//   },
//   {
//     original: 'https://picsum.photos/id/1019/500/300/',
//     thumbnail: 'https://picsum.photos/id/1019/250/150/',
//   },
// ];

//console.log(ogimages);


  return (
    <div>
    <h3>{displayName}</h3>
    <Camera 
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
    />
        <ImageGallery items={images} />
    </div>

  );
};

export {PhotoField};





