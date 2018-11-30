import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import { db as database } from '../firebase/firebase';
import { byPropKey } from '../helpers/helpers';

import Announcements from './Announcement';

class HomePage extends Component{
  constructor(props){
    super(props);
    this.state = {
      announcements: null
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
  }

  render(){
    const announcements = this.state.announcements;
    var announcementElems = <h3>No Announcements!</h3>;
    if(!!announcements){
      announcementElems = <Announcements announcements={announcements}/>;
    }
    return(
      <div>
        <h1>Home Page</h1>
        <div id="home-announcements">
          <h2>Announcements</h2>
          <div id="announcement-list">
            {announcementElems}
          </div>
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) =>
  !!authUser;

export default withAuthorization(authCondition)(HomePage);
