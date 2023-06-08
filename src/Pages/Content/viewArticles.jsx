import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { initFirebaseBackend } from '../helpers/firebase_helper';
import CardContainer from './CardContainer';
import sjcl from 'sjcl';

const ViewArticles = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fireBaseBackend = initFirebaseBackend()
    if (fireBaseBackend) {
      fireBaseBackend.getDbCollection(props.articleName).then(res => {
        const tempData = [];
        res.forEach(doc => {
          const decryptedData = sjcl.decrypt('my-iconicStartup-key', doc.data().data);
          const parsedData = JSON.parse(decryptedData);
          tempData.push(parsedData)
        })
        setData(tempData)
      }).catch(error => {
        props.setErrorAlert(`Failed to fetch Article Data`)
        console.log(error)
      })
    }

  }, []);

  return (
    props?.user ==="user" ? <CardContainer articles={data}/>: <div style={{ padding: "10px" }}>
      {data.length > 0 && data.map((article) => (
        <Card key={article.id} className="mt-3">
          <CardBody>
            <CardTitle>{`# ${props.index} : ${article.articleName}`}</CardTitle>
            <CardText>{article.articleDescription}</CardText>

            <div className="accordion" id={`accordion-${article.id}`}>
              {article.subtopics?.map((subtopic, index) => (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header" id={`heading-${article.id}-${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${article.id}-${index}`}
                      aria-expanded="true"
                      aria-controls={`collapse-${article.id}-${index}`}
                    >
                      {subtopic.subtopic}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${article.id}-${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${article.id}-${index}`}
                    data-bs-parent={`#accordion-${article.id}`}
                  >
                    <div className="accordion-body">{subtopic.description}</div>
                    {subtopic.image ? <img src={subtopic.image} /> : null}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};


export default ViewArticles;
