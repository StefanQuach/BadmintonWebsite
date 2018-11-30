import React, { Component } from 'react';

import { byPropKey, adminCheck, convertUnixTime } from "../helpers/helpers"
import { firebase, db, auth } from '../firebase'
import { db as database } from '../firebase/firebase';

var Button = require("react-bootstrap/lib/Button");

const Announcements = ({ announcements }) => {
  var announcementElems = announcements.map((ann) =>
    <SingleAnnouncement ann={ann} key={ann.key}/>
  );
  return(
    <div>{announcementElems}</div>
  );
}

class SingleAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.state = {editing: false};
  }

  deleteEvent() {
    database.ref(`announcements`).child(this.props.ann.key).remove();
  }

  render(){
    return(
      <div>
        {!this.state.editing?
          <ViewAnn
            ann={this.props.ann}
            onClickEdit={event => this.setState({editing: true})}
            onClickDelete={event => this.deleteEvent()}
          /> :
          <EditAnn
            ann={this.props.ann}
            onClick={event => this.setState({editing: false})}
            id={this.props.ann.key}
          />}
      </div>
    );
  }
}

const ViewAnn = ({ann, onClickEdit, onClickDelete}) => {
  return(
    <div className="announcement">
      <h3>{ann.title}</h3>
      <div className="announcement-caption">By: {ann.author}</div>
      <div className="announcement-caption">Last Updated: {convertUnixTime(ann.timestamp)}</div>
      <div className="announcement-content">{ann.content}</div>
      <AdminButton text={"Edit"} onClick={onClickEdit}/>
      <AdminButton text={"Delete"} onClick={onClickDelete}/>
      <hr/>
    </div>
  );
}

class EditAnn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.ann.title,
      content: this.props.ann.content,
      publicEvent: this.props.ann.public
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const ttitle = this.state.title;
    const tcontent = this.state.content;
    const tpublic = Boolean(this.state.publicEvent);

    const tauthor = firebase.auth.currentUser.uid;
    const tonClick = this.props.onClick;
    database.ref(`announcements`).child(this.props.ann.key).update({
      'title': ttitle,
      'content': tcontent,
      'author': tauthor,
      'timestamp': Date.now(),
      'public': tpublic,
    }, function(error) {
      if(error) {
        console.log("update failed!");
      } else {
        console.log("update successful!");
        tonClick(event);
      }
    });
  }
  render(){
    const{
      title,
      content,
      publicEvent,
    } = this.state;
    const isInvalid = title === '' || content === '';

    return(
      <form id={this.props.id} onSubmit={event => this.onSubmit(event)}>
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
            className="announcement-textarea"
            onChange={event => this.setState(byPropKey('content', event.target.value))}
            value={content}></textarea>
        </div>
        <div className="form-group">
          <input
            id="announcement-public"
            checked={Boolean(publicEvent)}
            onChange={event => this.setState(byPropKey('publicEvent', !!event.target.checked))}
            type="checkbox"/> Check this to make the announcement public
        </div>
        <div className="form-group">
          <button disabled={isInvalid} type="submit">
            Create Announcement
          </button>
        </div>
      </form>
    );
  }
}

/**
 * Button that only appears when the current user is an Admin
 */
class AdminButton extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this._isMounted = true;
    adminCheck(firebase.auth.currentUser).then((isAdmin) => {
      if(this._isMounted) {
        this.setState({admin: isAdmin});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return(
      <span>{this.state.admin ? <Button onClick={this.props.onClick}>{this.props.text}</Button> : <div></div>}</span>
    );
  }
}

export default Announcements;
