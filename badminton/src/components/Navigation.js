import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import SignOutButton from './SignOut';
import SignInPage from './SignIn';
import * as routes from '../constants/routes';

var Navbar = require("react-bootstrap/lib/Navbar"),
    Nav = require("react-bootstrap/lib/Nav"),
    NavDropdown = require("react-bootstrap/lib/NavDropdown"),
    MenuItem = require("react-bootstrap/lib/MenuItem"),
    NavItem = require("react-bootstrap/lib/NavItem");

const Navigation = ({ authUser }) =>
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to={routes.LANDING}>WUSTL Badminton</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} href="#">
            Rankings
          </NavItem>
          <NavItem eventKey={2} href="#">
            About Us
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavDropdown eventKey={1} title="Guest" id="basic-nav-dropdown">
            {authUser
              ? <NavigationAuth />
              : <NavigationNonAuth />
            }
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>


const NavigationAuth = () =>
  <div>
    <MenuItem eventKey={1.1}>Action</MenuItem>
    <MenuItem eventKey={1.2}>Another action</MenuItem>
    <MenuItem eventKey={1.3}>Something else here</MenuItem>
    <MenuItem divider />
    <MenuItem eventKey={1.4}><SignOutButton /></MenuItem>
  </div>

const NavigationNonAuth = () =>
  <div>
    <MenuItem eventKey={1.1}>
      <SignInPage />
    </MenuItem>
    <MenuItem divider />
    <MenuItem eventKey={1.2}><NavLink to={routes.SIGN_UP}>Register</NavLink></MenuItem>
  </div>

export default Navigation;
