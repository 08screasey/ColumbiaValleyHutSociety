import React from 'react';
import { Link } from 'react-router-dom';
import './HomeAccessUpdate.css';

const HomeAccessUpdate = (props) => {
    return (
        <div className="col-12 p-2">
            <li className={'HomeAccessUpdate'}>
                <h3 className="text-left Blue mx-2 mt-2 mb-4 Font4">{props.header}</h3>
                <p className="text-left Font5 m-2">{props.content.substring(0, 300) + ' ... '}</p>
                <div className="d-flex HomeAccessUpdateLink justify-content-end">
                    <Link to={'/updates/' + props.id} className="text-left">
                        Read On ->
                    </Link>
                </div>
            </li>
            <hr className="mt-3 mb-0" />
        </div>
    );
};

export default HomeAccessUpdate;
