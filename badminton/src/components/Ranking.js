import React, { Component } from 'react';

import withAuthorization from './withAuthorization';

import { db } from '../firebase';
import { db as database } from '../firebase/firebase';

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
      this.setState({users: newUsers});
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

const RankList = ({users}) =>{
  const userList = users.map((user) =>
    <div className="rank-element" key={user.key}>
      <div className="rank-rank">
        {user.rank}
      </div>
      <div className="rank-username">
        {user.username}
      </div>
    </div>
  );
  return(
    <div>
      {userList}
    </div>
  );
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(RankingPage);
