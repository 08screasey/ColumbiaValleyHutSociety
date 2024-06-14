import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from './containers/Layout/Layout';
import Home from './containers/Home/Home';
import AccountInfo from './containers/AccountInfo/AccountInfo';
import Huts from './containers/Huts/Huts';
import Rules from './containers/Rules/Rules';
import ImportantAccessUpdates from './containers/ImportantAccessUpdates/ImportantAccessUpdates';
import Reservations from './containers/Reservations/Reservations';
import Auth from './containers/Auth/Auth';
import Contact from './containers/Contact/Contact';

import Logout from './containers/Auth/Logout/Logout';
import Admin from './containers/AccountInfo/Admin/Admin';
import Verify from './containers/Auth/Verify/Verify';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

function App(props) {
    useEffect(() => {
        props.onInitAuthCheck();
        props.onFetchNews();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="App">
            <Layout>
                <Switch>
                    <Route path="/huts" component={Huts} />
                    <Route path="/updates" component={ImportantAccessUpdates} />
                    <Route path="/rules-amenities" component={Rules} />
                    <Route path="/reservations" component={Reservations} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/login" component={Auth} />
                    <Route path="/verify/:hash" component={Verify} />
                    {props.authenticated ? <Route path="/account-info" component={AccountInfo} /> : null}
                    <Route path="/admin" component={Admin} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/" exact component={Home} />
                    <Redirect to="/" />
                </Switch>
            </Layout>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFetchNews: () => dispatch(actions.fetchNews()),
        onInitAuthCheck: () => dispatch(actions.initAuthCheck()),
    };
};

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.token !== null,
        userId: state.auth.userData._id,
        token: state.auth.token,
        articles: state.news.accessUpdates.length > 0,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
