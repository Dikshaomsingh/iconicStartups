import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const EditPopupArticle = ({ isOpen, onClose, onSave, data }) => {
    const [editedData, setEditedData] = useState(data);

    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
            reader.onload = function () {
                resolve(reader.result)
            };
            reader.onerror = function (error) {
                reject(error)
            };

        })

    }

    const handleArticleFieldChange = (event, articleIndex, subtopicIndex) => {
        event.stopPropagation()
        const { name, value } = event.target;
        setEditedData((prevData) => {
            const newData = [...prevData];
            if (subtopicIndex !== undefined) {
                if (name === "image") {
                    getBase64(event.target.files[0]).then(res => {
                        newData[articleIndex].subtopics[subtopicIndex][name] = res
                    })
                }
                newData[articleIndex].subtopics[subtopicIndex][name] = value;
            } else {
                newData[articleIndex][name] = value;
            }
            return newData;
        });
    };
    const handleAddSubtopic = (e, articleIndex) => {
        e.stopPropagation()
        const newData = [...editedData];
        newData[articleIndex].subtopics = [...newData[articleIndex].subtopics, { subtopic: '', description: '', image: null }]
        setEditedData(newData)
    }

    const handleSave = () => {
        onSave(editedData);
    };

    return (
        <Modal
            show={isOpen}
            toggle={() => {
                onClose();
            }}
            scrollable={true}
        >
            <div className="modal-header">
                <h5 className="modal-title mt-0" id="myModalLabel">
                    Edit Article
                </h5>
                <button
                    type="button"
                    onClick={() => {
                        onClose(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <Form className="popup-content mb-3">
                    {editedData?.map((article, articleIndex) => (
                        <div key={articleIndex}>
                            <Form.Group controlId="articleNamePopup">
                                <Form.Label>Article Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="articleName"
                                    value={article.articleName}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="articleDescriptionPopup">
                                <Form.Label>Article Description:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="articleDescription"
                                    defaultValue={article.articleDescription}
                                    onChange={(event) => handleArticleFieldChange(event, articleIndex)}
                                />
                            </Form.Group>
                            {article.subtopics.length > 0 ? article.subtopics.map((subtopic, subtopicIndex) => (
                                <Form.Group controlId="subtopicIndexPopup" key={subtopicIndex}>
                                    <Form.Label>Subtopic:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subtopic"
                                        value={subtopic.subtopic}
                                        onChange={(event) => handleArticleFieldChange(event, articleIndex, subtopicIndex)}
                                    />
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        defaultValue={subtopic.description}
                                        onChange={(event) => handleArticleFieldChange(event, articleIndex, subtopicIndex)}
                                    />
                                    <Form.Group controlId={`subtopicImage${subtopicIndex}`}>
                                        <Form.Label>Image:</Form.Label>
                                        <Form.Control type="file" value={subtopic.image > 0 ? subtopic.image : ""} name="image" onChange={(event) => handleArticleFieldChange(event, articleIndex, subtopicIndex)} />
                                    </Form.Group>
                                </Form.Group>
                            ))
                                : null}
                            {<Button className="btn btn-secondary" style={{ margin: "5px 0" }} onClick={(e) => handleAddSubtopic(e, articleIndex)}>
                                Add Subtopic
                            </Button>}
                        </div>
                    ))}
                </Form>

            </div>
            <div className="modal-footer">
                <Button className="btn btn-dark" onClick={() => handleSave()}>Save Changes</Button>
                <Button className="btn btn-secondary" data-dismiss="modal" onClick={() => onClose()}>Cancel</Button>

            </div>
        </Modal>
    );
};

export default EditPopupArticle;
