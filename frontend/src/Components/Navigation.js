/*React-specific imports */
import React, { useState } from "react";
import { Link } from "react-router-dom";

/*Import Components from react-bootstrap */
import Navbar from "react-bootstrap/Navbar"
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

/*Icons */
import { GiBeaver } from "react-icons/gi";

function Navigation() {
  const [expandbar, setExpandbar] = useState(false);

  return (
    <Navbar
      fixed="top"
      expand="md"
      className= "black-navbar"
    >
      <Container className="navbar-styles">
      <Navbar.Brand
          href="/"
          className="d-flex"
        >
          <GiBeaver style={{marginTop: "8px", marginRight: "7px"}}/> Oregon State Database Tracker
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{backgroundColor: "#0165E1"}}
          onClick={() => {
            setExpandbar(expandbar ? false : "expanded");
          }}
        ></Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav" >
        <Nav.Item >
              <Nav.Link as={Link} to="/" >
                Home
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/student" >
                Student
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/course" >
                Courses
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/instructor" >
                Instructors
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/company" >
                Companies
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/review" >
                Reviews
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/earning" >
                Earnings
              </Nav.Link>
        </Nav.Item>
        <Nav.Item >
              <Nav.Link as={Link} to="/enrollment" >
                Enrollments
              </Nav.Link>
        </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation