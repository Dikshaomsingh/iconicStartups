import React from "react";

const DefaultPage = () => {
    {console.log("in default Page")}
    return <React.Fragment>
        <div className="card">
            <div className="card-header">
                Attention
            </div>
            <div className="card-body">
                <blockquote className="blockquote mb-0">
                    <p>This Page will be available in coming updates. Please explore other sections.</p>
                    <footer className="blockquote-footer">Regards <cite title="Source Title">iconicStartup group</cite></footer>
                </blockquote>
            </div>
        </div>
    </React.Fragment>
}

export default DefaultPage