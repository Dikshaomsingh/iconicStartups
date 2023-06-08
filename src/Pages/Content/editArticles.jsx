import React, { useEffect, useState } from 'react';
import { Table, Button } from 'reactstrap';
import { initFirebaseBackend } from '../helpers/firebase_helper';
import EditPopupArticle from './popupArticle';
import sjcl from 'sjcl';

const EditArticles = (props) => {
  const [articleData, setArticleData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [response, setResponse] = useState('');
  const [randomKey, setRandomKey] = useState(0)
  const fireBaseBackend = initFirebaseBackend()

  const setUpFirebaseDb = () => {
    if (fireBaseBackend) {
      fireBaseBackend.getDbCollection(props.articleName).then(res => {
        const tempData = [];
        res.forEach(doc => {
          const decryptedData = sjcl.decrypt('my-iconicStartup-key', doc.data().data);
          const parsedData = JSON.parse(decryptedData);
          parsedData.id = doc.id
          tempData.push(parsedData)
        })
        setArticleData(tempData)
      }).catch(error => {
        props.setErrorAlert(`Failed to fetch Article Data`)
        console.log(error)
      })
    }
  }

  useEffect(() => {
    setUpFirebaseDb()
  }, []);


  const editSubtopic = (articleData) => {
    setIsOpen(true);
    setRandomKey(Math.floor(Math.random() * 10))
    setSelectedData(articleData);

  }

  const handleSaveChanges = (updatedData) => {
    if (updatedData.length > 0) {
      const articleName = updatedData[0].articleName, articleId = updatedData[0].id, data = updatedData[0];
      const updatedEncryptedData = { data: sjcl.encrypt("my-iconicStartup-key", JSON.stringify(data)) };
      fireBaseBackend.updateDbCollection(articleName, articleId, updatedEncryptedData).then(res => {
        setResponse(`${articleName} : Article Updated SuccessFully`)
        setArticleData(updatedData);
      }).catch(error => {
        props.setErrorAlert(`Failed to Update Article Data : ${articleName}`)
        console.log(error)
      })
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setUpFirebaseDb()
    setIsOpen(false);
  };

  const handleDeleteSubtopic = (articleId, subtopicIndex) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subtopic?');
    if (confirmDelete) {
      const updatedData = [...articleData];
      const articleIndex = updatedData.findIndex((article) => article.id === articleId);

      if (articleIndex !== -1) {
        const articleName = updatedData[articleIndex].articleName
        updatedData[articleIndex].subtopics.splice(subtopicIndex, 1);
        const data = updatedData[0]
        // Encrypt the modified object back to a string
        const updatedEncryptedData = { data: sjcl.encrypt("my-iconicStartup-key", JSON.stringify(data)) };
        fireBaseBackend.updateDbCollection(articleName, articleId, updatedEncryptedData).then(res => {
          setResponse(`${articleName} : Article Updated SuccessFully`)
          console.log(res)
          // Update component state
          setArticleData(updatedData);

        }).catch(error => {
          props.setErrorAlert(`Failed to update Article Data : ${articleName}`)
          console.log(error)
        })
      }
    }
  };

  const handleDeleteArticle = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (confirmDelete) {
      fireBaseBackend.deleteCollection(props.articleName).then(res => {
        setResponse(`${props.articleName} : Article Deleted SuccessFully`)
        props.getNewArticleList(props.articleName)
        console.log(res)
      }).catch(error => {
        props.setErrorAlert(`Failed to Delete Article : ${props.articleName}`)
        console.log(error)
      })
      props.setRefresh()
    }
  };

  return (
    <div className="table-responsive">
      {response ? <div className="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{response}</strong>
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div> : null}
      <Table className="table table-secondary table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="align-bottom">Article Name</th>
            <th>Article Description</th>
            <th>Subtopic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articleData?.map((article, index) => (
            <React.Fragment key={article.id}>
              <tr>
                <td className="text-align-center" rowSpan={article?.subtopics?.length}>{article?.articleName}</td>
                <td rowSpan={article?.subtopics?.length}>{article?.articleDescription}</td>
                <td>{article.subtopics && article.subtopics.length > 0 ? article.subtopics[0].subtopic : null}</td>
                <td>
                  {article.subtopics && article.subtopics.length > 0 ? <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteSubtopic(article.id, 0)}
                  >
                    Delete
                  </Button> : null}
                </td>
              </tr>
              {article.subtopics && article.subtopics.length > 0 && article?.subtopics?.slice(1).map((subtopic, index) => (
                <tr key={index}>
                  <td>{subtopic.subtopic}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteSubtopic(article.id, index + 1)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end">
                  <Button
                    color="warning"
                    size="sm"
                    style={{ marginRight: "3px" }}
                    onClick={() => editSubtopic([article])}
                  >
                    Edit Article
                  </Button>
                  <Button style={{ marginLeft: "3px" }} color="danger" size="sm" onClick={() => handleDeleteArticle()}>
                    Delete Article
                  </Button>
                </td>
              </tr>
              <EditPopupArticle
                key={randomKey}
                isOpen={isOpen}
                onClose={handleClose}
                onSave={handleSaveChanges}
                data={articleData}
              />
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EditArticles;
