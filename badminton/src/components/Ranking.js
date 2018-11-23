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
        user_obj.challengeButton = false;
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
    this.requestChallenge = this.requestChallenge.bind(this);
  }

  requestChallenge(key, username){
    if(firebase.auth.currentUser.uid !== key){
      database.ref(`pending-challenge-requests`).push({
        'challenger': firebase.auth.currentUser.uid,
        'opponent': key,
      });
      this.setState(byPropKey('alert', <Alert
        text={'Your request was received and is being processed.'}
        color={'#00ff00'}
        />
      ));
      setTimeout(() => {this.setState(byPropKey('alert', null))}, 4000);
    }else{
      this.setState(byPropKey('alert', <Alert
        text={'You cannot challenge yourself.'}
        color={'#ff0000'}
      />));
      setTimeout(() => {this.setState(byPropKey('alert', null))}, 3000);
    }
  }

  componentDidMount(){
    database.ref(`users/${firebase.auth.currentUser.uid}`).once('value', (snapshot) => {
      var snapUser = snapshot.val();
      var rank = snapUser.rank;
      var id = snapshot.key;
      var users = this.state.users;
      database.ref(`pending-challenge-requests`).on('value', (requestSnap) => {
        var requests = requestSnap.val();
        for(var i = 0; i<users.length; i++){
          var rankDiff = rank - users[i].rank;
          if(rankDiff > 0 && rankDiff <= 4){
            users[i].challengeButton = true;
          }
          for(var key in requests){
            if(requests[key].challenger === id && requests[key].opponent === users[i].key){
              users[i].challengeButton = false;
            }
          }
        }
        this.setState(byPropKey('users', users));
      });
    });
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
          {user.challengeButton && <ChallengeButton user={user} onClick={this.requestChallenge}/>}
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

const ChallengeButton = ({ user, onClick }) =>
  <div>
    <button onClick={() => onClick(user.key, user.username)}>Request Challenge</button>
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(RankingPage);
