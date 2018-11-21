import React from 'react';

import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';
import * as routes from '../constants/routes';
import loadingImg from '../imgs/loading.gif';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    constructor(props){
      super(props);
      this.state = {access: false}
    }

    componentDidMount(){
      this.listener = firebase.auth.onAuthStateChanged(async authUser => {
        if(! await authCondition(authUser)){
          this.props.history.push(routes.LANDING);
        }else{
          this.setState({access: true});
        }
      });
    }

    componentWillUnmount(){
      this.listener();
    }

    render() {
      var hasAccess = this.state.access;
      var display = hasAccess ? <Component {...this.props}/> : <Loading/>
      return (
        <div>
          {display}
        </div>
      );
    }
  }

  const Loading = () =>
    <img src={loadingImg} alt="Loading"/>

  return withRouter(WithAuthorization);
}

export default withAuthorization;
