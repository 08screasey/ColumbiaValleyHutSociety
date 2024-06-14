import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from '../../../components/UI/Modal/Modal';
import EditUpdate from './EditUpdate/EditUpdate';
import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import { Redirect, withRouter } from 'react-router-dom';
import Comments from './Comments/Comments';
import checkValidity from '../../../Utility Functions/Validity Checker';
import formCheck from '../../../Utility Functions/Form Check';
import * as actions from '../../../store/actions/index';
import { faTrashAlt, faCheckCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const findById = (id, news) => {
    const update = news.find((article) => {
        return article._id === id;
    });
    return update;
};

const ImportantAccessUpdate = (props) => {
    const id = props.location.pathname.split('/')[2];

    const [article, updateArticle] = useState(findById(id, props.news));

    useEffect(() => {
        if (!article) {
            props.history.push('/updates');
        }
    });

    const [adminDelete, setAdminDelete] = useState(false);
    const [adminEdit, setAdminEdit] = useState(false);

    const [form, setForm] = useState({
        header: {
            value: article ? article.header : null,
            valid: true,
            touched: true,
            validity: { required: true },
        },
        content: {
            value: article ? article.content : null,
            valid: true,
            touched: true,
            validity: { required: true },
        },
    });

    const [validForm, setValidForm] = useState(true);

    const handleInputChange = (e, identifier) => {
        const newForm = { ...form };
        newForm[identifier].value = e.target.value;
        newForm[identifier].touched = true;
        newForm[identifier].valid = checkValidity(newForm[identifier].validity, newForm[identifier]);
        setForm(newForm);
        setValidForm(formCheck(newForm));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        props.onUpdateNews(id, { header: form.header.value, content: form.content.value }, props.token);
        setAdminEdit(false);
    };

    useEffect(() => {
        const newArticle = findById(id, props.news);

        updateArticle(newArticle);

        if (!newArticle) {
            props.history.push('/updates');
        }
    }, [props.news, id, props.history]);

    if (!article) {
        return <Redirect to="/updates" />;
    }

    return (
        <div style={{ paddingTop: '100px' }} className="pb-4 Grey-BG">
            <div className=" mx-auto mt-3 mb-5" style={{ width: '90%', 'max-width': '800px' }}>
                {props.admin ? (
                    <div className="w-100 d-flex justify-content-end mb-3">
                        {adminEdit ? (
                            <Modal
                                big
                                closeModal={() => {
                                    setAdminEdit(false);
                                }}
                            >
                                <EditUpdate
                                    closeEdit={() => {
                                        setAdminEdit(false);
                                        props.onClearUpdate();
                                    }}
                                    form={form}
                                    disabled={!validForm}
                                    formSubmit={handleFormSubmit}
                                    inputChange={(event, identifier) => handleInputChange(event, identifier)}
                                />
                            </Modal>
                        ) : props.updated ? (
                            <Modal small success closeModal={() => props.onClearUpdate()}>
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="Green m-auto" size="4x" />
                                    <p className="mx-auto my-3">Post successfully updated.</p>
                                </div>
                            </Modal>
                        ) : adminDelete ? (
                            <Modal
                                small
                                error
                                touchedBackdrop={() => setAdminDelete(false)}
                                closeModal={() => {
                                    setAdminDelete(false);
                                    props.onDeleteNews(id, props.userData, props.token);
                                }}
                            >
                                <ErrorAlert
                                    error={{
                                        message: 'Yes, delete this post and all of the comments associated with it.',
                                        status: 'Are You Sure?',
                                    }}
                                />
                            </Modal>
                        ) : null}
                        <span onClick={() => setAdminEdit(true)} className="text-right">
                            <FontAwesomeIcon icon={faPencilAlt} className="BrightBlue text-right mr-5" size="1x" />
                        </span>
                        <span onClick={() => setAdminDelete(true)} className="text-right">
                            <FontAwesomeIcon icon={faTrashAlt} className="Red text-right" size="1x" />
                        </span>
                    </div>
                ) : null}
                <h3 className="DarkBlue">{article.header}</h3>

                <small>{new Date(article.date).toLocaleDateString()}</small>
                <div className="py-0" style={{ wordBreak: 'break-all' }}>
                    {article.content.split(/\n/).map((paragraph, key) => {
                        const classes = ['mb-0'];
                        if (paragraph[0] === `~`) {
                            classes.push('text-center Bungee DarkBlue my-3');
                        } else {
                            classes.push('text-left');
                        }
                        return (
                            <p className={classes.join(' ')} key={key}>
                                {paragraph}
                            </p>
                        );
                    })}
                </div>
            </div>
            <Comments comments={article.comments} />
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        news: state.news.accessUpdates,
        userData: state.auth.userData,
        token: state.auth.token,
        updated: state.news.newUpdate,
        admin: state.auth.userData.admin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteNews: (id, userData, token) => dispatch(actions.deleteNews(id, userData, token)),
        onUpdateNews: (id, content, token) => dispatch(actions.updateNews(id, content, token)),
        onClearUpdate: () => dispatch(actions.clearUpdate()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImportantAccessUpdate));
