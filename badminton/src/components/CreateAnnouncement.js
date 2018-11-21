import React, { Component } from 'react';

import { firebase } from '../firebase'
import { db as database } from '../firebase/firebase';
import { byPropKey } from '../helpers/helpers';

const INITIAL_STATE = {
  title: '',
  content: ''
};

class CreateAnnouncementPage extends Component{
  constructor(props){
    super(props);

    this.state = {...INITIAL_STATE};
  }

  onSubmit(event) {
    event.preventDefault();
    const{
      title,
      content,
    } = this.state;

    console.log(title);
    console.log(content);
    console.log(firebase.auth.currentUser.uid);
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
              onChange={event => this.setState(byPropKey('content', event.target.value))}
              value={content}></textarea>
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

export default CreateAnnouncementPage;
