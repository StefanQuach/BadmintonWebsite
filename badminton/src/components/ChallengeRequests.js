import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import { firebase, db } from '../firebase';
import { db as database } from '../firebase/firebase';
import { adminCheck, byPropKey } from '../helpers/helpers';

class ChallengeRequestPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      requests: null,
    };
  }

  componentDidMount(){
    database.ref(`pending-challenge-requests`).on('value', (snapshot) => {
      this.setState(byPropKey('requests', snapshot.val()));
    });
  }

  render(){
    const requests = this.state.requests;
    var dispRequests = [];
    if(!!requests){
      for(var key in requests){
        dispRequests.push(<ChallengeRequest
          key={key}
          cKey={requests[key].challenger}
          oKey={requests[key].opponent}
        />);
      }
    }
    return(
      <div>
        <h1>Challenge Requests</h1>
        <div id="challenge-request-list">{dispRequests}</div>
      </div>
    );
  }
}

class ChallengeRequest extends Component{
  constructor(props){
    super(props);
    this.state = {...this.props};
    this.state.challenger = null;
    this.state.opponent = null;
  }

  componentDidMount(){
    this.getUserInfo(this.state.cKey, 'challenger');
    this.getUserInfo(this.state.oKey, 'opponent');
  }

  getUserInfo(uid, stateKey){
    database.ref(`users/${uid}`).once('value', (snapshot) => {
      this.setState(byPropKey(stateKey, snapshot.val()));
    });
  }

  render(){
    return(
      <div className="challenge-request">
        <div className="cr-info">
          <div className="cr-challenger cr-participant">
            {this.state.challenger && this.state.challenger.username}
          </div>
          <div className="cr-text">
            CHALLENGES
          </div>
          <div className="cr-opponent cr-participant">
            {this.state.opponent && this.state.opponent.username}
          </div>
        </div>
        <div className="cr-control">
          <div className="cr-ctrl-action">
            <button className="cr-resolve cr-button">Resolve</button>
          </div>
          <div className="cr-ctrl-action">
            <button className="cr-dismiss cr-button">Dismiss</button>
          </div>
        </div>
      </div>
    );
  }
}

const authCondition = adminCheck;

export default withAuthorization(authCondition)(ChallengeRequestPage);
