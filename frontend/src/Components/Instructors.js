import React, { useState, useEffect } from "react";

/*Import components from react-bootstrap */
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

/*
Citation for the following react library:
Date: 2/14/2023
Based on React-Bootstrap library for styling, easier component building:
The following components were imported: Container,Row,Col,Form,Nav,Navbar,Button
Source URL: https://react-bootstrap.github.io/
*/

/*
Citation for the following JavaScript email checker:
Date: 2/14/2023
An endsWith method that checks whether or not the email ends with the specific .edu
Source URL: https://www.w3schools.com/Jsref/jsref_endswith.asp#:~:text=JavaScript%20String%20endsWith%20%28%29%201%20Description%20The%20endsWith,endsWith%20%28%29%20is%20an%20ECMAScript6%20%28ES6%29%20feature.%20
*/

function Instructors() {
  // The form state which decides which form is filled out.
  // For example clicking on add makes form 1, update makes form 2.
  const [form, setForm] = useState(false);
  // The instructor data which is pulled for the backend 
  const [instructors, setInstructorData] = useState([]);
  // The email error which is a boolean state
 
  

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('http://flip4.engr.oregonstate.edu:4283/instructor')
      .then(response => response.json())
      .then(data => setInstructorData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Form data which is a useState object
  // Note some fields are set to the default values if not selected
  const [formData, setFormData] = useState({
    instructorName: '',
    instructorEmail: '',
    instructorGender: 'M',
    instructorQualifications: '',
    yearsTaught: '',
  });


  // handleChange arrow function called everytime a field is filled out
  // Destructure e.target which has name,target
  // update state with the previous formData object and new attribute:value pair
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  // Check if any of the fields are empty
  const checkEmpty = () => {
    for (const field in formData) {
      if (field === 'yearsTaught') {
        return true
      }
      if (formData[field] === '') {
        alert('One or more of your fields are still empty. Please fill it out.')
        return false
      }
    }
    return true
  }

 
  // On submit prevent webpage reload and check conditions
  // Conditions whether or not fields are empty
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkEmpty()) {
      return
    }
    try {
      const response = await fetch('http://flip4.engr.oregonstate.edu:4283/instructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Instructor added successfully');
        fetch('http://flip4.engr.oregonstate.edu:4283/instructor') 
          .then(response => response.json())
          .then(data => setInstructorData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add instructor', error);
    }
  };
  
  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
          <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Instructor
          </button>
          {form && (
            <>
              <h1>Add Instructor </h1>
              <Row>
              <Col md={7}>
              <Form className="form-box" onSubmit={handleSubmit}>
              Fields marked * are required
                  <Form.Group className="mb-2">
                          <Form.Label>Name*</Form.Label>
                          <Form.Control type="text" placeholder="Name" name="instructorName"
                            value={formData.instructorName}
                            onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                          <Form.Label>Email*</Form.Label>
                          <Form.Control type="text" placeholder="Email" name="instructorEmail"
                            value={formData.instructorEmail}
                            onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                          <Form.Label>Gender*</Form.Label>
                          <Form.Control
                            as="select"
                            name="instructorGender"
                            value={formData.instructorGender}
                            onChange={handleChange}
                          >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="X">Intersex</option>
                          </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-5">
                        <Form.Label>Qualifications*</Form.Label>
                        <Form.Control as="textarea" rows="3"
                        placeholder="Qualifications" 
                        name="instructorQualifications"
                        value={formData.instructorQualifications}
                        onChange={handleChange} 
                        />
                    </Form.Group>
                  <Form.Group className="mb-5">
                        <Form.Label>Years Taught</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Years Taught" 
                        name="yearsTaught"
                        value={formData.yearsTaught}
                        onChange={handleChange} 
                        />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Add Instructor
                  </Button>
                </Form>
              </Col>
            </Row>
            </>
          )}
          <Table striped bordered hover style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>instructorID#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Qualifications</th>
                  <th>Years Taught</th>
                </tr>
              </thead>
            <tbody>
                {instructors.map(instructor => (<tr>
                  <td>{instructor.instructorID}</td>
                  <td>{instructor.instructorName}</td>
                  <td>{instructor.instructorEmail}</td>
                  <td>{instructor.instructorGender}</td>
                  <td>{instructor.instructorQualifications}</td>
                  <td>{instructor.yearsTaught}</td>
                </tr>))}
              </tbody>
          </Table>
        </Container>
      </Container>
    </section>
  );
}


export default Instructors;
