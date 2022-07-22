import { useContext } from 'react';
import {
  Navbar, Container, Nav,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext, logout } from '../contexts/AuthContext';
import logo from '../assets/favicon.ico';

function NavBar() {
  const { user, dispatch } = useContext(AuthContext);

  return (
    <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
      <Container>
        <NavLink to="/" className="poppins h3 m-0 brand text-decoration-none text-dark">
          <img src={logo} width="30" height="30" className="d-inline-block align-top rounded" alt="FlashCards logo" />
          <span className="text-warning ms-2">FLASH </span>
          CARDS
        </NavLink>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <div className="d-flex justify-content-start align-items-sm-center flex-column flex-sm-row">
                <NavLink to="/" className="d-flex px-2 py-1 text-decoration-none navIcon">
                  <i className="bi bi-house-fill " />
                  <span className="ms-1 details-info ">Home</span>
                </NavLink>
                <NavLink to="/login" className="d-flex px-2 py-1 text-decoration-none navIcon" onClick={() => logout(dispatch)}>
                  <i className="bi bi-box-arrow-in-right" />
                  <span className="ms-1 details-info">Logout</span>
                </NavLink>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="d-flex px-2 py-1 text-decoration-none">
                  <span className="ms-1 details-info">Login</span>
                </NavLink>
                <NavLink to="/register" className="d-flex px-2 py-1 text-decoration-none">
                  <span className="ms-1 details-info">Register</span>
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
