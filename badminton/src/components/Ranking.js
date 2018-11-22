import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import Alert from './Alert';

import { db } from '../firebase';
import { db as database } from '../firebase/firebase';
import { firebase } from '../firebase';
import { byPropKey } from '../helpers/helpers';

const RankingPage = () =>
  <div>
    <h1>Rankings</h1>
    <Ranks />
  </div>

class Ranks extends Component {
  constructor(props){
    super(props);
    this.state = { users: null }
  }

  componentDidMount(){
    database.ref(`users`).orderByChild('rank').on('value', (snapshot) => {
      var newUsers = []
      snapshot.forEach(function(childSnap){
        var user_obj = childSnap.val();
        user_obj.key = childSnap.key;
        newUsers.push(user_obj);
      });
      this.setState(byPropKey('users', newUsers));
    });
  }

  render() {
    return (
      <div>
        { !!this.state.users && <RankList users={this.state.users} /> }
      </div>
    );
  }
}

class RankList extends Component{
  constructor(props){
    super(props);
    this.state = {
      users: this.props.users,
      alert: null,
    };
  }

  requestChallenge(key, username){
    database.ref(`pending-challenge-requests`).push({
      'challenger': firebase.auth.currentUser.uid,
      'opponent': key,
    });
    this.setState(byPropKey('alert', <Alert
      text={'Your request was received and is being processed.'}
      color={'#00ff00'}
      />
    ));
    setTimeout(() => {this.setState(byPropKey('alert', null))}, 5000);
  }

  render(){
    const userList = this.state.users.map((user) =>
      <div className="rank-element" key={user.key}>
        <div className="rank-rank">
          {user.rank}
        </div>
        <div className="rank-user-controls">
          <div className="rank-username">
            {user.username}
          </div>
          <div>
            <button onClick={() => this.requestChallenge(user.key, user.username)}>Request Challenge</button>
          </div>
        </div>
      </div>
    );
    return(
      <div>
        {this.state.alert}
        {userList}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(RankingPage);
