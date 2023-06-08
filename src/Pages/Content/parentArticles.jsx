import React, { useEffect, useState } from 'react';
import { initFirebaseBackend } from '../helpers/firebase_helper';
import EditArticles from "./editArticles";
import ViewArticles from "./viewArticles";
import { animateScroll as scroll } from 'react-scroll';
import "./CardContainer.css";

const ParentArticle = (props) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('')
    const [refresh,setRefresh] = useState(false)    
    const fireBaseBackend = initFirebaseBackend()

    useEffect(() => {
        if (fireBaseBackend) {
            fireBaseBackend.getDbCollection('articleName').then(res => {
                res.forEach(doc => {
                    console.log("article list", doc.data().articleName)
                    setData(doc.data().articleName)
                })
            })
        }

    }, [refresh]);

    const getNewArticleList = (articleName)=>{
        let value = data.filter(item=>item!==articleName)
        fireBaseBackend.postArticleNameList(value,false).then(res=>{
            console.log("collection List",res)
            setData(value)
          }).catch(error=>{
            props.setError(`Failed to add Article Name in the ArticleList`)
            console.log(error)
        })
    }

    const getArticle = (name) => {
        switch (name) {
            case 'edit': return <>{data?.map((item, key) => <EditArticles index={key + 1} getNewArticleList={getNewArticleList} setRefresh={setRefresh} articleName={item} setErrorAlert={setError} />)}</>
            case 'adminView': return <>{data?.map((item, key) => <ViewArticles index={key + 1} articleName={item} setErrorAlert={setError} user="admin"/>)}</>
            case 'userView': return <div  className="cardContainer">{data?.map((item, key) => <ViewArticles index={key + 1} articleName={item} setErrorAlert={setError} user="user"/>)}</div>
            default: return null
        }
    }
    const scrollToTop = () => {
        scroll.scrollToTop();
    };
    return (
        <>
            {error?<div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Sorry!!</strong> Something went wrong. {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>:null}
            {getArticle(props.articleName)}
            <button onClick={scrollToTop}>Scroll to Top</button>
        </>
    )
}

export default ParentArticle