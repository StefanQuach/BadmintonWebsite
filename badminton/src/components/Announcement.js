import React, { Component } from 'react';

import { adminCheck, convertUnixTime } from "../helpers/helpers"
import { firebase, db, auth } from '../firebase'
import { db as database } from '../firebase/firebase';

var Button = require("react-bootstrap/lib/Button");

const Announcements = ({ announcements }) => {
  console.log(announcements);
  var announcementElems = announcements.map((ann) =>
    <ViewAnnouncement ann={ann}/>
  );
  return(
    <div>{announcementElems}</div>
  );
}

class ViewAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.state = {editing: false};
  }

  onClick() {
    this.setState({editing: true});
  }

  render(){
    return(
      <div className="announcement" key={this.props.ann.key}>
        <h3>{this.props.ann.title}</h3>
        <div className="announcement-caption">By: {this.props.ann.author}</div>
        <div className="announcement-caption">Last Updated {convertUnixTime(this.props.ann.timestamp)}</div>
        <div className="announcement-content">{this.props.ann.content}</div>
        <AdminButton text={"Edit"} onClick={() => console.log('')}/>
        <hr/>
      </div>
    );
  }
}

class AdminButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    adminCheck(auth.currentUser).then((isAdmin) => {
      this.setState({admin: isAdmin});
    });

  }
  render() {
    return(
      <div>{this.state.admin ? <Button onClick={this.props.onClick}>{this.props.text}</Button> : <div></div>}</div>
    );
  }
}

export default Announcements;
