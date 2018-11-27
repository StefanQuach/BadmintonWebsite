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
      challengeRequests: null,
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
    database.ref(`pending-challenge-requests`)
      .orderByChild('challenger')
      .equalTo(firebase.auth.currentUser.uid)
      .on('value', (snapshot) => {
      var challengeRequests = [];
      var crSnap = snapshot.val();
      const component = this;
      for(var key in crSnap){
        // I have no idea so don't ask
        const tmp = function(k){
          return function(){
            database.ref(`users/${crSnap[key].opponent}`).on('value', (userSnap) => {
              var user = userSnap.val();
              var crObj = {
                username: user.username,
                key: k,
              };
              challengeRequests.push(crObj);
              component.setState({ challengeRequests: challengeRequests });
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
      challengeRequests,
    } = this.state;
    var announcementElems = <h3>No Announcements!</h3>;
    var challengeElems = <h3>No Pending Challenge Requests!</h3>
    if(!!announcements){
      announcementElems = <Announcements announcements={announcements}/>;
    }
    if(!!challengeRequests){
      challengeElems = <HomeChallengeRequestList userChallengeRequestList={challengeRequests}/>;
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
            <h2>My Pending Challenge Matches</h2>
            {challengeElems}
          </div>
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) =>
  !!authUser;

export default withAuthorization(authCondition)(HomePage);
