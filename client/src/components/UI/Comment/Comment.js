import React from 'react';
import './Comment.css';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router';

const Comment = (props) => {
    let hyperlink = null;
    if (props.fromAccount) {
        hyperlink = (
            <h4
                onClick={() => {
                    props.history.push('/updates/' + props.article._id);
                }}
                className="Font5 BrightBlue Bungee p-2 mb-3"
            >
                <span className="DarkBlue">Commented On:</span>{' '}
                <span className="BrightBlue Link">{props.article.header}</span>
            </h4>
        );
    }
    return (
        <div className="Comment my-2 position-relative">
            {hyperlink}

            <div className="CommentContent position-relative rounded py-2 px-2 DarkGrey-BG">
                <h6 className="Font5 text-left m-1">{props.comment.author}</h6>
                <p className="p-0 ml-2 my-0 pb-3 Font6 mr-5">{props.comment.content}</p>
                <small className="Font6 CommentDate">{new Date(props.comment.date).toLocaleDateString()}</small>
                {props.userId && props.userId === (props.comment.userId || props.admin) ? (
                    <span onClick={props.clicked} className="Red Font5 CommentDelete">
                        <FontAwesomeIcon icon={faTrashAlt} className="Red m-auto" size="1x" />
                    </span>
                ) : null}
            </div>
        </div>
    );
};

export default withRouter(Comment);
