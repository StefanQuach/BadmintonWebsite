import React, { Component } from 'react';

import { firebase, db, auth } from '../firebase'
import { db as database } from '../firebase/firebase';
import { byPropKey, adminCheck, convertUnixTime } from '../helpers/helpers';
import { withRouter } from 'react-router-dom';
import withAuthorization from './withAuthorization';
import * as routes from '../constants/routes';

var Button = require("react-bootstrap/lib/Button");

const INITIAL_STATE = {
  title: '',
  content: ''
};

class CreateAnnouncementPage extends Component{
  constructor(props){
    super(props);

    this.state = {...INITIAL_STATE};
  }
//componentDidMount
  onSubmit(event) {
    event.preventDefault();

    const{
      history,
    } = this.props;

    const ttitle = this.state.title;
    const tcontent = this.state.content;
    const tpublic = Boolean(this.state.public);

    const tauthor = firebase.auth.currentUser.uid;

    database.ref(`announcements`).push().set({
      'title': ttitle,
      'content': tcontent,
      'author': tauthor,
      'timestamp': Date.now(),
      'public': tpublic,
    });

    history.push(routes.HOME);
  }

  render(){
    const{
      title,
      content
    } = this.state;

    const isInvalid = title === '' || content === '';

    return(
      <div>
        <h1>Create An Announcement</h1>
        <form onSubmit={event => this.onSubmit(event)}>
          <div className="form-group">
            <input
              id="announcement-title"
              value={title}
              onChange={event => this.setState(byPropKey('title', event.target.value))}
              type="text"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <textarea
              id="announcement-content"
              class="announcement-textarea"
              onChange={event => this.setState(byPropKey('content', event.target.value))}
              value={content}></textarea>
          </div>
          <div className="form-group">
            <input
              id="announcement-public"
              value={false}
              onClick={event => this.setState(byPropKey('public', event.target.value))}
              type="checkbox"/> Check this to make the announcement public
          </div>
          <div className="form-group">
            <button disabled={isInvalid} type="submit">
              Create Announcement
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const authCondition = adminCheck;

export default withAuthorization(authCondition)(withRouter(CreateAnnouncementPage));
