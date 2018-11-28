import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import { db as database } from '../firebase/firebase';
import { firebase } from '../firebase';
import { byPropKey } from '../helpers/helpers';

import { Announcements } from './CreateAnnouncement';
import { HomeChallengeRequestList } from './ChallengeRequests';

class HomePage extends Component{
  constructor(props){
    super(props);
    this.state = {
      announcements: null,
      challengerRequests: null,
      opponentRequests: null,
    };
  }

  componentDidMount(){
    var component = this;
    this.listener = database.ref(`announcements`)
      .orderByChild('timestamp')
      .limitToLast(100)
      .on('value', (snapshot) => {
      var announcements = [];
      snapshot.forEach(function(childSnap){
        var announcement = childSnap.val()
        announcement.key = childSnap.key;
        announcements.unshift(announcement);
        // Replace the author's id with their username
        database.ref(`users/${announcement.author}`).once('value', (authorSnap) => {
          announcement.author = authorSnap.val().username;
          component.setState(byPropKey('announcements', announcements));
        });
      });
    });
    this.getChallengeRequests('challenger', 'challengerRequests');
    this.getChallengeRequests('opponent', 'opponentRequests');
  }

  getChallengeRequests(role, prop){
    database.ref(`pending-challenge-requests`)
      .orderByChild(role)
      .equalTo(firebase.auth.currentUser.uid)
      .on('value', (snapshot) => {
      var challengeRequests = [];
      var crSnap = snapshot.val();
      const component = this;
      var other = role === 'challenger' ? 'opponent' : 'challenger';
      for(var key in crSnap){
        // I have no idea so don't ask
        const tmp = function(k){
          return function(){
            database.ref(`users/${crSnap[key][other]}`).on('value', (userSnap) => {
              var user = userSnap.val();
              var crObj = {
                username: user.username,
                key: k,
              };
              challengeRequests.push(crObj);
              component.setState(byPropKey(prop, challengeRequests));
            });
          }
        }(key);
        tmp();
      }
    });
  }

  render(){
    const {
      announcements,
      challengerRequests,
      opponentRequests,
    } = this.state;
    var announcementElems = <h3>No Announcements!</h3>;
    var challengeElems = <h3>No Pending Challenge Requests!</h3>
    var opponentElems = <h3>No one wants to fight you!</h3>
    if(!!announcements){
      announcementElems = <Announcements announcements={announcements}/>;
    }
    if(!!challengerRequests){
      challengeElems = <HomeChallengeRequestList userChallengeRequestList={challengerRequests} type={"challenger"}/>;
    }
    if(!!opponentRequests){
      opponentElems = <HomeChallengeRequestList userChallengeRequestList={opponentRequests} type={"opponent"} />;
    }
    return(
      <div>
        <h1>Home Page</h1>
        <div id="home-page-body">
          <div id="home-announcements">
            <h2>Announcements</h2>
            <div id="announcement-list">
              {announcementElems}
            </div>
          </div>
          <div id="home-crs">
            <div>
              <h2>My Pending Challenge Matches</h2>
              {challengeElems}
            </div>
            <div>
              <h2>People Who Challenged Me to a Duel</h2>
              {opponentElems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) =>
  !!authUser;

export default withAuthorization(authCondition)(HomePage);
