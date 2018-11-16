import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

import AuthUserContext from './AuthUserContext';
import { SignInForm } from './SignIn';
import * as routes from '../constants/routes';

var Navbar = require("react-bootstrap/lib/Navbar"),
    Nav = require("react-bootstrap/lib/Nav"),
    NavDropdown = require("react-bootstrap/lib/NavDropdown"),
    MenuItem = require("react-bootstrap/lib/MenuItem"),
    NavItem = require("react-bootstrap/lib/NavItem");

const Navigation = () =>
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to={routes.LANDING}>WUSTL Badminton</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} componentClass={Link} href="/ranking" to="/ranking">
            Rankings
          </NavItem>
          <NavItem eventKey={2} href="#">
            About Us
          </NavItem>
        </Nav>
        <Nav pullRight>
          <AuthUserContext.Consumer>
            {authUser => authUser
              ? <NavigationAuth authUser={authUser}/>
              : <NavigationNonAuth />
            }
          </AuthUserContext.Consumer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>



const NavigationAuth = ({authUser}) =>
  <NavDropdown eventKey={1} title={authUser.displayName} id="basic-nav-dropdown">
    <MenuItem eventKey={1.1} componentClass={Link} href="/account" to="/account">User Info</MenuItem>
    <MenuItem eventKey={1.2}>Another action</MenuItem>
    <MenuItem eventKey={1.3}>Something else here</MenuItem>
    <MenuItem divider />
    <MenuItem eventKey={1.4} onClick={auth.doSignOut}>Logout</MenuItem>
  </NavDropdown>

class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
    };
  }

  inputWasClicked = () => {
    this._inputWasClicked = true;
  }

  onToggle = (open) => {
    if (this._inputWasClicked) {
      this._inputWasClicked = false;
      return;
    }
    this.setState({open: open});
  }

  render() {
    return(
      <NavDropdown
        eventKey={1}
        open={this.state.open}
        title="Guest"
        id="basic-nav-dropdown"
        onToggle={this.onToggle}>
        <MenuItem eventKey={1.1}>
          <h5>Sign In</h5>
          <SignInForm onSelect={this.inputWasClicked}/>
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={1.2} componentClass={Link} href="/signup" to="/signup">Don't have an account? Register</MenuItem>
      </NavDropdown>
    );
  }
}

export default Navigation;
