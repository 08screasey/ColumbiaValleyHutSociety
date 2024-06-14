import React, { useEffect } from 'react';
import './Hut.css';
import { withRouter } from 'react-router-dom';
import Hr from '../UI/Hr/Hr';
import HutAccess from './HutAccess/HutAccess';
import HutAbout from './HutAbout/HutAbout';
import HutStats from './HutStats/HutStats';
import HutMap from '../../containers/Huts/HutMap/HutMap';
import HutProvisions from './HutProvisions/HutProvisions';
import OpacityAnimation from '../UI/OpacityAnimation/OpacityAnimation';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import LatestAccessUpdates from '../Widgets/LatestAccessUpdates/LatestAccessUpdates';
import { connect } from 'react-redux';
const Hut = (props) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    const urlString = props.match.path.split('/');

    const classes = ['Header-BG'];
    switch (urlString[2]) {
        case 'jumbo':
            classes.push('Jumbo');
            break;
        case 'olive':
            classes.push('Olive');
            break;
        case 'kingsbury':
            classes.push('Kingsbury');
            break;
        case 'david-white':
            classes.push('David');
            break;
        case 'mcmurdo':
            classes.push('McMurdo');
            break;
        default:
            break;
    }

    return (
        <LazyLoadComponent>
            <div className={classes.join(' ')}>
                <div className="Header-BG-Overlay"></div>
            </div>
            <div className="Hut Grey-BG">
                <h3 className="Font0 Grey">{props.hut.name}</h3>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-xl-3 order-md-1 order-2">
                            <OpacityAnimation classes="my-3">
                                <h4 className="Font3 DarkBlue mb-4 TextOutline">Extra Tools</h4>
                                <h5 className="Font4 Orange">Topographical maps:</h5>
                                <p>
                                    Order online from Service BC. Rocky Mountain Forest District offers free Recreation
                                    Maps that will show most of the current roads.{' '}
                                </p>
                                <h5 className="Font4 Orange">Road Conditions:</h5>
                                <p>
                                    It is advisable to check our Access Updates tab for the status of the roads you will
                                    be driving prior to heading in to a hut.
                                </p>
                                <h5 className="Font4 Orange">Avalance Report:</h5>
                                <p>
                                    Visit{' '}
                                    <a
                                        href="https://www.avalanche.ca/forecasts/purcells"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Avalance.Ca
                                    </a>{' '}
                                    for updated info.
                                </p>
                            </OpacityAnimation>
                            <div className=" Grey-BG py-3 px-2 Hut-FGO my-5 Raised">
                                <h4 className="Font4 DarkBlue TextOutline">Formal Government Objectives:</h4>
                                <p className="Font6 text-left">{props.hut.FGO}</p>
                            </div>
                            <HutMap {...props.hut} />
                            <div className="p-3">
                                {props.auth && (
                                    <button
                                        className="Button DarkBlue-BG Orange"
                                        onClick={() => {
                                            props.history.push(`/reservations/huts/${props.hut.dbName}`);
                                        }}
                                    >
                                        Make A Reservation
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-8 col-xl-6 order-md-2 order-1">
                            <h4 className="DarkBlue Font0 my-3 TextOutline">Stats</h4>
                            <HutStats {...props} />
                            <Hr />
                            <h4 className="DarkBlue Font0 TextOutline">Getting There</h4>
                            <HutAccess access={props.hut.access} />
                            <h4 className="DarkBlue Font0 TextOutline">Info</h4>
                            <HutAbout details={props.hut.details} />
                            <HutProvisions provisions={props.hut.provisions} prohibited={props.hut.prohibited} />
                        </div>
                        <div className="col-xl-3 order-md-3 order-3 mb-4">
                            <LatestAccessUpdates />
                        </div>
                    </div>
                </div>
            </div>
        </LazyLoadComponent>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth.token !== null,
    };
};

export default connect(mapStateToProps)(withRouter(Hut));
