import React, { Component } from 'react';
import { db as database } from '../firebase/firebase';
import { firebase, admin, db } from '../firebase';
import withAuthorization from './withAuthorization';
import Alert from './Alert';

var Button = require("react-bootstrap/lib/Button");

const AccountPage = () =>
  <div>
    <h1>Account Page</h1>
    <UserInfo/>
    <ChangeEmailForm />
    <ChangePasswordForm />
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

const UserTable = ({ info }) =>
  <div>
    {info.admin && <div>You are an admin</div>}
    <div>{info.username}</div>
    <div>{info.email}</div>
    <div>Rank: {info.rank}</div>
  </div>

class ChangeEmailForm extends Component{

  _isMounted = false;

  INITIAL_STATE = {
    email: '',
    alert: null,
  }

  constructor(props){
    super(props);
    this.state = {...this.INITIAL_STATE};
  }

  componentDidMount(){ this._isMounted = true; }
  componentWillUnmount(){ this._isMounted = false; }

  change(event){
    this.setState({email: event.target.value})
  }

  submit(event){
    event.preventDefault();
    const email = this.state.email;
    this.setState({email: ''});
    firebase.auth.currentUser.updateEmail(email)
      .then(() => {
        database.ref(`users/${firebase.auth.currentUser.uid}`).update({
          email: email,
        });
      })
      .catch((error) => {
        if(this._isMounted){this.setState({alert: <Alert color={'#ff0000'} text={error.message}/>});}
        setTimeout(() => {if(this._isMounted){this.setState({alert: null});}}, 3000);
      });
  }

  render(){
    const isValid = this.state.email !== '';
    return(
      <div>
        <h2>Update email</h2>
        <form onSubmit={(event) => this.submit(event)}>
          <input
            type="text"
            placeholder="New Email"
            onChange={(event) => this.change(event)}
            value={this.state.email}
          />
          <Button disabled={!isValid} type="submit">Change Email</Button>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

class ChangePasswordForm extends Component{

  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      npassword1: '',
      npassword2: '',
      alert: null,
    };
  }

  componentDidMount(){this._isMounted = true};
  componentWillUnmount(){this._isMounted = false;}

  change(key, event){
    this.setState({[key]: event.target.value});
  }

  submit(event){
    event.preventDefault();
    const npass = this.state.npassword1;
    this.setState({
      npassword1: '',
      npassword2: '',
    });
    firebase.auth.currentUser.updatePassword(npass)
      .then(() => {
        if(this._isMounted){this.setState({alert: <Alert color={'#00ff00'} text={'Successful update'}/>});}
        setTimeout(() => {if(this._isMounted){this.setState({alert: null});}}, 3000);
      })
      .catch((error) => {
        if(this._isMounted){this.setState({alert: <Alert color={'#ff0000'} text={error.message}/>});}
        setTimeout(() => {if(this._isMounted){this.setState({alert: null});}}, 4000);
      });
  }

  render(){
    const isValid = this.state.npassword1 === this.state.npassword2 && this.state.npassword1 !== '';

    return(
      <div>
        <h2>Change Password</h2>
        <form onSubmit={(event) => {this.submit(event)}}>
          <input
            value={this.state.npassword1}
            type="password"
            placeholder="New Password"
            onChange={(event) => {this.change('npassword1', event);}}
          />
          <input
            value={this.state.npassword2}
            type="password"
            placeholder="Confirm New Password"
            onChange={(event) => {this.change('npassword2', event);}}
          />
          <Button disabled={!isValid} type="submit">Change Password</Button>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
