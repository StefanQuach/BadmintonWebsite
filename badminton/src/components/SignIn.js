import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as helpers from '../helpers/helpers';

import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

var Form = require("react-bootstrap/lib/Form"),
    Button = require("react-bootstrap/lib/Button");

const SignInPage = ({ history }) =>
  <div>
    <h1>Sign In</h1>
    <SignInForm history={history} />
    <SignUpLink />
  </div>


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("logging in");
        this.setState({ ...INITIAL_STATE });
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(helpers.byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState(helpers.byPropKey('email', event.target.value))}
          onSelect={this.props.onSelect}
          type="text"
          placeholder="Email Address"
        /><br/>
        <input
          value={password}
          onChange={event => this.setState(helpers.byPropKey('password', event.target.value))}
          onSelect={this.props.onSelect}
          type="password"
          placeholder="Password"
        /><br/>
        <Button disabled={isInvalid} type="submit" onClick={this.onSubmit}>
          Sign In
        </Button>

        { error && <p>{error.message}</p> }
      </Form>
    );
  }
}

export default withRouter(SignInPage);
const SignInFormWithRouter = withRouter(SignInForm);
export {
  SignInForm,
  SignInFormWithRouter,
};
