import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebase, auth, db } from '../firebase';

import AuthUserContext from './AuthUserContext';
import { SignInFormWithRouter } from './SignIn';
import * as routes from '../constants/routes';
import { byPropKey } from '../helpers/helpers';

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

class NavigationAuth extends React.Component{
  constructor(props){
    super(props);
    this.state = {adminFuncs: null};
    this.setAdminState();
  }

  setAdminState(){
    db.userIsAdmin(firebase.auth.currentUser.uid).then((value) => {
      if(value){
        this.setState(byPropKey('adminFuncs', [
          <MenuItem divider key={2.0}/>,
          <MenuItem key={2.1} eventKey={2.1} componentClass={Link} href={routes.CREATE_ANNOUNCEMENT} to={routes.CREATE_ANNOUNCEMENT}>
            Create Announcement
          </MenuItem>
        ]));
      }
    });
  }
  render(){
    return(
      <NavDropdown eventKey={1} title={firebase.auth.currentUser.displayName} id="basic-nav-dropdown">
        <MenuItem eventKey={1.1} componentClass={Link} href={routes.ACCOUNT} to={routes.ACCOUNT}>My Account</MenuItem>
        <MenuItem eventKey={1.2} componentClass={Link} href={routes.HOME} to={routes.HOME}>Home</MenuItem>
        <MenuItem eventKey={1.3}>Something else here</MenuItem>
        {this.state.adminFuncs && this.state.adminFuncs.map((func) => func)}
        <MenuItem divider />
        <MenuItem eventKey={1.4} onClick={auth.doSignOut}>Logout</MenuItem>
      </NavDropdown>
    );
  }
}

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
        <MenuItem eventKey={1.1} onClick={this.inputWasClicked}>
          <h5>Sign In</h5>
          <SignInFormWithRouter onSelect={this.inputWasClicked}/>
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={1.2} componentClass={Link} href="/signup" to="/signup">Don't have an account? Register</MenuItem>
      </NavDropdown>
    );
  }
}

export default Navigation;
