import React from 'react';
import './AccountInfo.css';
import { connect } from 'react-redux';
import Comment from '../../components/UI/Comment/Comment';
import { addDays } from '../../Utility Functions/DateFunctions';

const AccountInfo = (props) => {
    let reservations = <li className="Raised p-5">You do not have any reservations on this account</li>;

    if (props.userData.reservations.length > 0) {
        reservations = props.userData.reservations.map((reservation, key) => {
            const classes = ['Raised', 'px-2', 'my-3', 'Trip', 'd-flex', 'align-items-center'];
            classes.push(reservation.hut);
            return (
                <li key={key} className={classes.join(' ')}>
                    <div className="row w-100 align-items-center">
                        <div className="col-5 col-md-6 " style={{ paddingLeft: '3%' }}>
                            <p className="m-3 Grey Font5 Bungee w-100">
                                <strong className="Grey m-2">Check-in:</strong>{' '}
                                {new Date(reservation.dates[0]).toLocaleDateString()}
                            </p>
                            <p className="m-3 Grey Font5 Bungee w-100">
                                <strong className="Grey m-2">Checkout:</strong>{' '}
                                {addDays(reservation.dates[reservation.dates.length - 1], 1)}
                            </p>
                        </div>
                        <div className="col-7 col-md-6 pl-2">
                            <h3
                                className="Grey text-center w-100 Font2"
                                onClick={() => props.history.push(`/huts/${reservation.hut}`)}
                            >
                                {reservation.hut.split('-').join(' ')}
                            </h3>
                        </div>
                    </div>
                </li>
            );
        });
    }

    return (
        <div className="AccountInfo Grey-BG container-fluid">
            <h2 className="TextOutline Orange Font1">
                {props.userData.firstName} {props.userData.lastName}
            </h2>
            <p className="mt-2 Bungee">Email: {props.userData.email}</p>
            {!props.userData.active ? (
                <small>
                    Note: Your account is not yet verified. Please activate your account through the email provided
                </small>
            ) : null}
            <div className="text-left m-auto" style={{ padding: '0 7%', maxWidth: '800px' }}>
                <h3 className="Font2 DarkBlue mt-5 mb-3 TextOutline ">Latest Comments</h3>
                {props.userData.comments.length > 0 ? (
                    props.userData.comments.map((comment) => {
                        const article = props.news.reduce((acc, current) => {
                            if (current._id === comment.articleId) {
                                return { _id: current._id, header: current.header };
                            } else {
                                return acc;
                            }
                        }, {});

                        return (
                            <Comment
                                key={comment._id}
                                fromAccount
                                userId={props.userData.userId}
                                comment={comment}
                                article={article}
                            />
                        );
                    })
                ) : (
                    <p className="Raised p-5">You do not have any comments on this account</p>
                )}
            </div>
            <div className="AccountReservations py-2 text-left ">
                <h3 className="Font2 DarkBlue my-3 TextOutline" style={{ paddingLeft: '8%' }}>
                    My Trips
                </h3>
                <ul className="p-2" style={{ listStyle: 'none' }}>
                    {reservations}
                </ul>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.token !== null,
        userData: state.auth.userData,
        news: state.news.accessUpdates,
    };
};

export default connect(mapStateToProps, null)(AccountInfo);
