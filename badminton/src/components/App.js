import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import withAuthentication from './withAuthentication';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import HomePage from './Home';
import AccountPage from './Account';
import RankingPage from './Ranking';
import CreateAnnouncementPage from './CreateAnnouncement';
import ChallengeRequestPage from './ChallengeRequests';

import * as routes from '../constants/routes';

class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <Navigation />

          <hr/>
          <Switch>
            <Route
              exact path={routes.LANDING}
              component={LandingPage}
            />
            <Route
              exact path={routes.SIGN_UP}
              component={SignUpPage}
            />
            <Route
              exact path={routes.SIGN_IN}
              component={SignInPage}
            />
            <Route
              exact path={routes.HOME}
              component={HomePage}
            />
            <Route
              exact path={routes.ACCOUNT}
              component={AccountPage}
            />
            <Route
              exact path={routes.RANKING}
              component={RankingPage}
            />
            <Route
              exact path={routes.CREATE_ANNOUNCEMENT}
              component={CreateAnnouncementPage}
            />
            <Route
              exact path={routes.CHALLENGE_REQUESTS}
              component={ChallengeRequestPage}
            />
            <Redirect to='/' />
          </Switch>
        </div>
      </Router>
    );
  }
}

// export default App;
export default withAuthentication(App);
