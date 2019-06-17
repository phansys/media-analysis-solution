import React from 'react';
import {NavLink as RRNavLink, Link} from 'react-router-dom';
import {NavbarBrand, Navbar, Nav, NavItem, NavLink} from 'reactstrap';
import nubityIcon from './../img/nubity-icon.png';

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Navbar color="dark">
          <NavbarBrand tag={Link} to="/">
            <img alt="Media Analysis Solution" src={nubityIcon} className="brand-image" />
            <span className="ml-2 text-white">Nubity media solution</span>
          </NavbarBrand>
          <Nav className="ml-auto">
            <NavItem>
              <NavLink tag={RRNavLink} to="/bimbo-live" className="text-light" activeClassName="active">Bimbo</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/live" className="text-light" activeClassName="active">Live</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/" className="text-light" activeClassName="active" exact>Media</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/collection" className="text-light" activeClassName="active">Collection</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRNavLink} to="/settings" className="text-light" activeClassName="active">Settings</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <hr />
        {this.props.children}
        <hr />
      </div>
    )
  }
}
