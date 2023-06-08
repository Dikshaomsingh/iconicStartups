import withRouter from "../../common/withRouter";
import React from "react";
import { Card, CardBody, CardTitle, Col, Row, Container } from 'reactstrap';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const ArticleDetails = (props) => {
  const article = props.router.location.state[0]
  return (
    <div className="page-content">
      <Container fluid={true}>

        <Row>
          <Col sm={12}>
            <h4 className="my-3">{article.articleName}</h4>
            <p className="mb-3" style={{ backgroundColor: '#FEC006' }}>
              <i className="mdi mdi-bullseye-arrow me-3">{article.articleDescription}</i>
            </p>

            <Row data-masonry='{"percentPosition": true }'>
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
              >
                <Masonry
                  columnsCount={3}
                  gutter="24px"
                >
                  {article.subtopics?.map((subtopic, index) => (

                    <Card>

                      <CardTitle className="mt-0">{subtopic.subtopic}</CardTitle>
                      {subtopic.image ? <img src={subtopic.image} className="card-img-top" alt="..." /> : <div style={{ background: "black", height: "10px", width: "100%" }}></div>}
                      <CardBody>
                        <p className="card-text" >{subtopic.description}</p>
                      </CardBody>
                    </Card>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )

}

export default withRouter(ArticleDetails);
