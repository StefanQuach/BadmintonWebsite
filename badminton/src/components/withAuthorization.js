import React from 'react';

import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';
import * as routes from '../constants/routes';
import loadingImg from '../imgs/loading.gif';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {

    componentDidMount(){
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if(!authCondition(authUser)){
          this.props.history.push(routes.LANDING);
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component {...this.props} /> : <Loading/>}
        </AuthUserContext.Consumer>
      );
    }
  }

  const Loading = () =>
    <img src={loadingImg}/>

  return withRouter(WithAuthorization);
}

export default withAuthorization;
