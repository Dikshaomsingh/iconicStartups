import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardContainer.css";

const CardContainer = ({ articles }) => {
  const navigate = useNavigate();

  //   redirecting to about component
  const redirectToAbout = () => {
    navigate("/articleDetails", {
      state: articles,
    });
  };


  return (
    <div>
      {articles?.map((article, key) => <div key={key} className="cardColumn">
        <Article key={key} index={key} details={article} />
        <div style={{ display: "flex", justifyContent: "center" }}><button type="button" className="btn btn-dark learnBtn" onClick={() => redirectToAbout()}>Learn More</button></div>
      </div>)}
    </div>
  )
}

const Article = (props) => {
  const details = props.details
  return (
    <article className="article">
      <h3 className="article__category" style={{ backgroundColor: '#FEC006' }}>{details.articleName}</h3>
      {/* <h2 className="article__title">{details.title}</h2> */}
      <p className="article__excerpt">{details.articleDescription}</p>
    </article>
  )
}

export default CardContainer
