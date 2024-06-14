import React, { useState } from 'react';
import './Image.css';

const Image = (props) => {
    const [enlarged, setEnlarged] = useState(false);

    const clickHandler = () => {
        setEnlarged(true);
    };

    return (
        <React.Fragment>
            <div
                className={enlarged ? 'Enlarge Active' : 'Enlarge'}
                onClick={() => {
                    setEnlarged(false);
                }}
            ></div>
            <img
                src={props.source}
                className={enlarged ? 'Enlarge-Image' : null}
                onClick={() => clickHandler()}
                alt={'Gallery Icon'}
            />
        </React.Fragment>
    );
};

export default Image;
