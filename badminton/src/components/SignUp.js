import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import * as helpers from '../helpers/helpers';

import { auth } from '../firebase/firebase';
import { db } from '../firebase';
import * as routes from '../constants/routes';

var Button = require('react-bootstrap/lib/Button');

const SignUpPage = ({ history }) =>
  <div>
    <h1>Sign Up</h1>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.createUserWithEmailAndPassword(email, passwordOne)
      .then((user) => {
        //user=auth.currentUser;
        if(user){
          auth.currentUser.updateProfile({
            displayName: this.state.username,
          }).then(() => {
            db.doCreateUser(user.user.uid, username, email, false)
              .then(() => {
                this.setState({ INITIAL_STATE });
                history.push(routes.HOME);
              })
              .catch(error => {
                this.setState({error});
              });
          });
        }
      })
      .catch(error => {
        this.setState(helpers.byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={username}
          onChange={event => this.setState(helpers.byPropKey('username', event.target.value))}
          type="text"
          placeholder="Full Name"
        /><br/>
        <input
          value={email}
          onChange={event => this.setState(helpers.byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        /><br/>
        <input
          value={passwordOne}
          onChange={event => this.setState(helpers.byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        /><br/>
        <input
          value={passwordTwo}
          onChange={event => this.setState(helpers.byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        /><br/>
        <Button disabled={isInvalid} type="submit">
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};
