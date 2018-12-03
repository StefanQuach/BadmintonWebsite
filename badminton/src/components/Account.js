import React, { Component } from 'react';
import { db as database } from '../firebase/firebase';
import { firebase, admin, db } from '../firebase';
import withAuthorization from './withAuthorization';

var Button = require("react-bootstrap/lib/Button");

const AccountPage = () =>
  <div>
    <h1>Account Page</h1>
    <UserInfo/>
    <ChangeEmailForm />
  </div>

class UserInfo extends Component{
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      info: null,
    };
  }

  componentDidMount(){
    this._isMounted = true;
    database.ref(`users/${firebase.auth.currentUser.uid}`).on('value', (snapshot) => {
      if(this._isMounted){
        this.setState({ info: snapshot.val() });
      }
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render(){
    return(
      <div>
        <h2>My Info</h2>
        {this.state.info && <UserTable info={this.state.info} />}
      </div>
    );
  }
}

class ChangeEmailForm extends Component{

  INITIAL_STATE = {
    email: '',
  }

  constructor(props){
    super(props);
    this.state = {...this.INITIAL_STATE};
  }

  change(event){
    this.setState({email: event.target.value})
  }

  submit(event){
    event.preventDefault();
    const email = this.state.email;
    firebase.auth.currentUser.updateEmail(email)
      .then(() => {
        database.ref(`users/${firebase.auth.currentUser.uid}`).update({
          email: email,
        }, () => {this.setState({...this.INITIAL_STATE});});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(){
    const isValid = this.state.email !== '';
    return(
      <div>
        <h2>Update email</h2>
        <form>
          <input
            type="text"
            placeholder="New Email"
            onChange={(event) => this.change(event)}
            value={this.state.email}
          />
          <Button disabled={!isValid} onClick={(event) => this.submit(event)}>Change Email</Button>
        </form>
      </div>
    );
  }
}

const UserTable = ({ info }) =>
  <div>
    {info.admin && <div>You are an admin</div>}
    <div>{info.username}</div>
    <div>{info.email}</div>
    <div>Rank: {info.rank}</div>
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
