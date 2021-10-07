import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const PhotoField = ({handleFileUpload, value, displayName}) => {

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
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


        //console.log(value);

        //work on updating 
        //passing in the fieldKey (fieldType stays constant), handleSimpleUpdate, in handleTakePhoto add to images, set state for images array, refactor for loops to maps 
        

    const images = value.map(v => {return {original: v.uri, thumbnail: v.uri}});

    //console.log(images);

    
    // TODO: Delete this boi
//     const images = [
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

// console.log(ogimages);


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





