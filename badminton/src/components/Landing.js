import React, { Component } from 'react';

import { db as database } from '../firebase/firebase';
import { byPropKey } from '../helpers/helpers';

import Announcements from './Announcement';

class LandingPage extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      announcements: null
    };
  }

  componentDidMount(){
    this._isMounted = true;
    var component = this;
    this.listener = database.ref(`announcements`)
      .orderByChild('timestamp')
      .limitToLast(100)
      .on('value', (snapshot) => {
        if(this._isMounted) {
          var announcements = [];
          snapshot.forEach(function(childSnap){
            var announcement = childSnap.val()
            if (announcement.public) {
              announcement.key = childSnap.key;
              announcements.unshift(announcement);
            }
            // Replace the author's id with their username
            database.ref(`users/${announcement.author}`).once('value', (authorSnap) => {
              announcement.author = authorSnap.val().username;
              component.setState(byPropKey('announcements', announcements));
            });
          });
        }
      });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render(){
    const announcements = this.state.announcements;
    var announcementElems = <h3>No Announcements!</h3>;
    if(!!announcements){
      announcementElems = <Announcements announcements={announcements}/>;
    }
    return(
      <div>
        <h1>Landing</h1>
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


export default LandingPage;
