import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import UploadForm from './UploadForm';
import { initFirebaseBackend } from '../helpers/firebase_helper';
import sjcl from 'sjcl';

const ArticleForm = (props) => {
  const [articleName, setArticleName] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [subtopics, setSubtopics] = useState([{ subtopic: '', description: '', image: null }]);  
  const [uploadResponse,setUploadResponse]= useState(false)
  const fireBaseBackend = initFirebaseBackend()
  const [image,setImage] = useState('')

  const handleSubtopicChange = (index, key, value) => {
    const updatedSubtopics = [...subtopics];
    updatedSubtopics[index][key] = value;
    setSubtopics(updatedSubtopics);
  };

  const handleImageChange = (index, file) => {
    const updatedSubtopics = [...subtopics];
    //updatedSubtopics[index].image = URL.createObjectURL(file); //convert blob into base64
    // getBase64(file,setImage)
    // console.log("file in create article",typeof file, file ,"---", image)
    // setSubtopics(updatedSubtopics);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log("in onload",reader.result)
      updatedSubtopics[index].image = reader.result
      setSubtopics(updatedSubtopics)
       // cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  };

  const handleAddSubtopic = () => {
    setSubtopics([...subtopics, { subtopic: '', description: '', image: null }]);
  };

  const handleRemoveSubtopic = (index) => {
    const updatedSubtopics = [...subtopics];
    updatedSubtopics.splice(index, 1);
    setSubtopics(updatedSubtopics);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    // Perform submission logic here 
    const articles = {"articleName":articleName,"articleDescription":articleDescription,"subtopics":subtopics};
    //console.log("articles",articles)
    const serializedData = JSON.stringify(articles);
    const encryptedData = sjcl.encrypt("my-iconicStartup-key", serializedData);
  
    fireBaseBackend.postDbCollection(articleName,{data:encryptedData}).then(res=>{
      //console.log("res add collection",res)      
    fireBaseBackend.postArticleNameList(articleName,true).then(res=>{
      console.log("res add collection",res)
    }).catch(error=>{
      props.setError(`Failed to add Article Name in the ArticleList`)
      console.log(error)
  })
    if(res){
      setArticleName('')
      setArticleDescription('')
      setSubtopics([{ subtopic: '', description: '', image: null }])
      setUploadResponse(true)
    }
    }).catch(error=>{
      props.setError(`Failed to create Article Data`)
      console.log(error)
  })
    //console.log(db)
  };

  useEffect(()=>{
    if(articleName||articleDescription||subtopics[0].subtopic){
      setUploadResponse(false)
    }
  },[articleName,articleDescription,subtopics])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Article Details</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="articleName">
            <Form.Label>Article Name:</Form.Label>
            <Form.Control type="text" value={articleName} onChange={(e) => setArticleName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="articleDescription">
            <Form.Label>Article Description:</Form.Label>
            <Form.Control as="textarea" value={articleDescription} onChange={(e) => setArticleDescription(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="subtopics">
            <Form.Label>Subtopics:</Form.Label>
            {subtopics.map((subtopic, index) => (
              <div key={index} className="subtopic">
                <Form.Control
                  type="text"
                  placeholder="Subtopic"
                  value={subtopic.subtopic}
                  onChange={(e) => handleSubtopicChange(index, 'subtopic', e.target.value)}
                />
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  value={subtopic.description}
                  onChange={(e) => handleSubtopicChange(index, 'description', e.target.value)}
                />
                <Form.Group controlId={`subtopicImage${index}`}>
                  <Form.Label>Image:</Form.Label>
                  <Form.Control type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} />
                </Form.Group>
                {index > 0 && (
                  <Button variant="danger" style={{margin:"5px 0"}} onClick={() => handleRemoveSubtopic(index)}>
                    Remove Subtopic
                  </Button>
                )}
              </div>
            ))}
            <Button variant="secondary" style={{marginTop:"5px"}} onClick={handleAddSubtopic}>
              Add Subtopic
            </Button>
          </Form.Group>
         {uploadResponse?<div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Article Uploaded Successfully!</strong>
                <button type="button" style={{margin:"5px 0"}} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>:null}
          <Button variant="dark" style={{margin:"5px 0"}} type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const ArticlesPost = () => {  
  const [error, setError] = useState('')
  return (
    <div className="container" style={{marginTop:"15px"}}>
       {error?<div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Sorry!!</strong> Something went wrong. {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>:null}
      <div className="row">
        <div className="col-md-6">
          <UploadForm setError={setError} imageKey="slides"/>
        </div>
        <div className="col-md-6">
          <ArticleForm setError={setError}/>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPost;
