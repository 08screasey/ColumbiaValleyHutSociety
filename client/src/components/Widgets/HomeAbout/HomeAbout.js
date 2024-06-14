import React from 'react';

const HomeAbout = (props) => {
    return (
        <div className="HomeAbout m-auto my-5 pt-3" style={{ width: '90%', maxWidth: '750px' }}>
            <h2 className="Font1 DarkBlue TextOutline">About The CVHS</h2>
            <p className="pt-2">
                The Columbia Valley Hut Society is a non-profit organization established in 1983 by a small group of
                friends with a passion for the backcountry. Over the past thirty years Society members have worked
                together with the BC government to build and maintain five huts in remote locations in the Northern
                Purcell Mountains.
            </p>{' '}
            <p>
                These backcountry cabins and huts offer rustic accommodations for self-propelled, non-motorized
                recreationalists in some of the most beautiful scenery in Western Canada. Members of the Society are
                happy to share these huts with others who have a similar commitment to the preservation of special
                mountain places.{' '}
            </p>
            <p>
                Hiking or skiing distances into the huts will vary from one person to the next as well as yearly as they
                are dependent on both route-finding expertise and road conditions. It is a good idea to carry a
                topographical map of the area for the hike in and some basic road clearing tools (chainsaw, shovel,
                tow-rope) for the drive to the trailhead.
            </p>
        </div>
    );
};

export default HomeAbout;
