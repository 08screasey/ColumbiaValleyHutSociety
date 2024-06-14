import React, { useEffect } from 'react';
import HomeAccessUpdates from '../../components/Widgets/HomeAccessUpdates/HomeAccessUpdates';
import './ImportantAccessUpdates.css';
import ImportantAccessUpdate from './ImportantAccessUpdate/ImportantAccessUpdate';
import CreateUpdate from './CreateUpdate/CreateUpdate';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

const ImportantAccessUpdates = (props) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <Switch>
            <Route
                path="/updates"
                exact
                render={() => {
                    return (
                        <React.Fragment>
                            <div className="Header-BG Updates"></div>
                            <div className="UpdateContainer Grey-BG pb-5">
                                <HomeAccessUpdates quantity="8" />
                                {props.admin ? (
                                    <button
                                        onClick={() => props.history.push('/updates/create')}
                                        className="AddButton Bungee DarkBlue Grey-BG Button"
                                    >
                                        Add New Update
                                    </button>
                                ) : null}
                            </div>
                        </React.Fragment>
                    );
                }}
            />
            <Route path="/updates/create" component={CreateUpdate} />
            <Route path="/updates/:id" component={ImportantAccessUpdate} />
        </Switch>
    );
};

const mapStateToProps = (state) => {
    return {
        admin: state.auth.userData.admin,
    };
};

export default connect(mapStateToProps)(ImportantAccessUpdates);
