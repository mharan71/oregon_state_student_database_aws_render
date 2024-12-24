import React from "react";

/*Import components from react-bootstrap */
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Homepage() {
  return (
    <section>
      <Container fluid className="homepage-basic-info" id="home">
        <Container className="homepage-content">
          <Row>
            <Col md={7}>
              <p className="homepage-introduction">
                <h1>About</h1>
                Oregon State University's Database Tracker system records
                student information for 400 current post baccalaureate students
                enrolled in our program.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <p
                className="homepage-introduction"
                style={{ marginBottom: "500px" }}
              >
                Please use the navigation links above to navigate through
                different pages. The user can add, update, or delete students.
                One can also add course, instructor and company information.
                Users can also report reviews they've had for courses they have
                taken. The user can also view information about a students
                earnings, and see how OSU's program has impacted their salary.{" "}
                <b>
                  Included helpful tooltips below for certain fields
                  that were unclear
                </b>
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default Homepage;
