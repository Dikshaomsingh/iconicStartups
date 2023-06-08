import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
//import disabledCamera from '../../images/disabledCamera.svg';
// import setupIndexedDB from '../../indexedDb/indexedDb';
// import {storeEncryptDataToDb,retrieveDataFromDb, modifyDbData} from "../../indexedDb/helper"
import { initFirebaseBackend } from '../helpers/firebase_helper';


const UploadForm = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [useCamera,setUseCamera] = useState(false);
  // const [db, setDb] = useState(null);
  const [uploadResponse,setUploadResponse]= useState(false)  
  const fireBaseBackend = initFirebaseBackend()
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  let mediaStream = null;

  const handleFileChange = (event) => {
    setUploadResponse(false)
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    stopCamera();
  };

  const startCamera = async () => {    
    setUploadResponse(false)
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = mediaStream;
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = async() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

//   const stopCameraPermission = () => {
//     if (mediaStream) {
//       mediaStream.getTracks().forEach((track) => {
//         track.stop(); // Stop each track of the media stream
//       });
//       mediaStream = null; // Reset the media stream variable
//     }
//   };

  
// // Function to check camera usage and stop camera if not in use
// const checkCameraUsage = () => {
//   const activeCameraUsers = document.querySelectorAll('.camera-preview video').length;

//   if (activeCameraUsers === 0) {
//     stopCameraPermission();
//   }
// };

// // Add event listeners to check camera usage
// document.addEventListener('DOMContentLoaded', checkCameraUsage);
// document.addEventListener('visibilitychange', checkCameraUsage);
// window.addEventListener('beforeunload', stopCamera);

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const capturedImage = canvas.toDataURL();
    const file = dataURLtoFile(capturedImage, 'capturedImage.png');
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDiscard=()=>{
    setSelectedFile(null);
    setPreviewImage(null);
    startCamera()
  }

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUpload = async (e) => {
    // Perform upload logic here
    e.preventDefault();
    const key = props.imageKey
    const values = {key: JSON.stringify(selectedFile)}
    //let response;
    fireBaseBackend.postDbCollection(key,values).then(response=>{
        setUploadResponse(response)
        setSelectedFile(null)
        setPreviewImage(null)
        setUseCamera(false)
        stopCamera()
    }).catch(error=>{
      props.setError(`Failed to Upload Images`)
      console.log(error)
  })
  };

  useEffect(()=>{
      !useCamera ? stopCamera():startCamera()
  },[useCamera])


  return (
    <Card>
      <Card.Body>
        <Card.Title>Upload Picture For Home Page Slider</Card.Title>
        <Form>
          <Form.Group controlId="formFile">
            <Form.Label>Choose a picture:</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Form.Group controlId="formCamera">
            <Form.Label>Turn on/off the camera:</Form.Label>
            <Button variant="dark p-10" style={{margin:"5px"}} onClick={()=>setUseCamera(!useCamera)}>
              {useCamera?'Stop':'Start'}
            </Button>
          </Form.Group>
          <div className="camera-preview">
            {previewImage ? (
              <Image src={previewImage} alt="Preview" fluid />
            ) : (
              uploadResponse?<div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Image Uploaded Successfully!</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>:<video ref={videoRef} width="100%" height="auto" />
            )}
          </div>
          <Button variant="dark" style={{margin:"5px"}}  disabled={previewImage}  onClick={handleCapture}> 
            Capture
          </Button>
          <Button variant="dark" style={{margin:"5px"}}  disabled={!previewImage}  onClick={handleDiscard}> 
            Discard
          </Button>
          <Button variant="dark" style={{margin:"5px"}}  disabled={!selectedFile} onClick={handleUpload}>
            Upload
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UploadForm;
//disabled={!videoRef.current}