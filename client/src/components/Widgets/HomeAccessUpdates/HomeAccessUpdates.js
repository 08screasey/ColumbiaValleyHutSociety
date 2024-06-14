import React from 'react';
import HomeAccessUpdate from './HomeAccessUpdate/HomeAccessUpdate';
import './HomeAccessUpdates.css';
import { connect } from 'react-redux';

const HomeAccessUpdates = (props) => {
    let newestUpdates = null;
    if (props.news) {
        newestUpdates = props.news.slice(0, props.quantity).map((update, id) => {
            return (
                <HomeAccessUpdate
                    key={id}
                    id={update._id}
                    header={update.header}
                    content={update.content}
                    date={update.date}
                />
            );
        });
    }
    return (
        <React.Fragment>
            <h2 className="DarkBlue Font1 TextOutline py-4">Important Access Updates</h2>
            <ul
                className="HomeAccessUpdates p-2 row Raised mx-auto mt-2 mb-5 position-relative"
                style={{ width: '96%', 'max-width': '800px' }}
            >
                {newestUpdates}
            </ul>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        news: state.news.accessUpdates,
    };
};

export default connect(mapStateToProps)(HomeAccessUpdates);
