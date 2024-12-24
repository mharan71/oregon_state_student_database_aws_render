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

function Companies() {

  const [form, setForm] = useState(false);
  // The Company data which is pulled for the backend 
  const [companies, setCompanyData] = useState([]);


  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/company')
      .then(response => response.json())
      .then(data => setCompanyData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Form data which is a useState object
  // Note some fields are set to the default values if not selected
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
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
      if (formData[field] === '') {
        alert('One or more of your fields are still empty. Please fill it out.')
        return false
      }
    }
    return true
  }


  // On submit prevent webpage reload and check conditions

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkEmpty()) {
      return
    }
    try {
      const response = await fetch('https://oregon-state-student-database-aws-render.onrender.com/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Company added successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/company')
          .then(response => response.json())
          .then(data => setCompanyData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add company', error);
    }
  };



  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
          <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Company
          </button>
          {form && (
            <>
              <h1>Add Company </h1>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={handleSubmit}>
                    Fields marked * are required
                    <Form.Group className="mb-2" style={{ marginTop: "20px" }}>
                      <Form.Label> Company Name* </Form.Label>
                      <Form.Control type="text"
                        name="companyName"
                        placeholder="Name"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                      <Form.Text style={{ color: "whitesmoke" }}>
                        Please enter company name.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-5">
                      <Form.Label>Role*</Form.Label>
                      <Form.Control type="text"
                        placeholder="Role in company"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Add company
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>companyID#</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (<tr>
                <td>{company.companyID}</td>
                <td>{company.companyName}</td>
                <td>{company.role}</td>
              </tr>))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </section>
  );
}

export default Companies;
