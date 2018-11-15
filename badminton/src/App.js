import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './fire.js';

let Navbar = require("react-bootstrap/lib/Navbar");
let Nav = require("react-bootstrap/lib/Nav");
let NavDropdown = require("react-bootstrap/lib/NavDropdown");
let MenuItem = require("react-bootstrap/lib/MenuItem");
let NavItem = require("react-bootstrap/lib/NavItem");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {username: "Guest",
                  loggedIn: false};
  }

  login = () => {
    this.setState(state => ({ username: "yaboi", loggedIn: true }));
  };

  logout = () => {
    this.setState(state => ({ username: "Guest", loggedIn:false}));
  }

  render() {
    return (
      <div className="header">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#brand">WUSTL Badminton</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">
                Link
              </NavItem>
              <NavItem eventKey={2} href="#">
                Item
              </NavItem>
            </Nav>
            <Nav pullRight>
            <NavDropdown eventKey={1} title={this.state.username} id="basic-nav-dropdown">
            {!this.state.loggedIn ?
              [<MenuItem eventKey={1.1}>
                <input type="text" id="username" name="username" placeholder="Username"/><br/>
                <input type="password" id="password" name="password" placeholder="password"/><br/>
                <LoginButton onClick={this.login} />
              </MenuItem>,
              <MenuItem divider />,
              <MenuItem eventKey={1.2}>Register</MenuItem>]
              :
              [<MenuItem eventKey={1.1}>Action</MenuItem>,
              <MenuItem eventKey={1.2}>Another action</MenuItem>,
              <MenuItem eventKey={1.3}>Something else here</MenuItem>,
              <MenuItem divider />,
              <MenuItem eventKey={1.4} onClick={this.logout}>Logout</MenuItem>]}
            </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const LoginButton = ({ onClick }) => (
  <button onClick={onClick} type="button">
    Login
  </button>
);

// export default App;
export default App;
