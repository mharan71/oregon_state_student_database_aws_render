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

function Student() {
  // The form state which decides which form is filled out.
  const [form, setForm] = useState(false);
  const [updateform, setUpdateForm] = useState(false);
  // The student data which is pulled for the backend 
  const [students, setStudentData] = useState([]);
  // The student data which is pulled for the backend 
  const [companies, setCompanyData] = useState([]);
  // The email error which is a boolean state
  const [emailError, setEmailError] = useState(false)

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/student')
      .then(response => response.json())
      .then(data => setStudentData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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
    studentid: '',
    name: '',
    email: '',
    gender: 'M',
    company: '1',
    previousMajor: 'N/A',
    graduated: 'No'
  });

  // Update form to update form information once button is clicked
  const [updateFormData, setUpdateFormData] = useState({
    studentid: '',
    name: '',
    email: '',
    gender: 'M',
    company: '1',
    previousMajor: 'N/A',
    graduated: 'No'
  });

  // Display form function to change the closing and opening of forms
  const changeForms = (student) => {
    setForm(false)
    setUpdateForm(!updateform)
    setUpdateFormData({
      studentid: student.studentID,
      name: student.studentName,
      email: student.studentEmail,
      gender: student.studentGender,
      company: student.companyID,
      previousMajor: student.previousMajor,
      graduated: student.graduated
    })
    return
  }

  // handleChange arrow function called everytime a field is filled out
  // Destructure e.target which has name,target
  // update state with the previous formData object and new attribute:value pair
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
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

  const checkEmptyUpdate = () => {
    for (const field in updateFormData) {
      if (updateFormData[field] === '') {
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
    if (formData.studentid.length !== 6) {
      alert('Your student ID is not 6 digits.')
      return
    }
    // Checks if the email ends with @oregonstate.edu
    if (!formData.email.endsWith("@oregonstate.edu")) {
      setEmailError(true)
      return
    }
    try {
      const response = await fetch('https://oregon-state-student-database-aws-render.onrender.com/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Student added successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/student')
          .then(response => response.json())
          .then(data => setStudentData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add student', error);
    }
  };


  // Update the student table
  const updateStudent = async (e) => {
    e.preventDefault();
    if (!checkEmptyUpdate()) {
      return
    }
    if (!updateFormData.email.endsWith("@oregonstate.edu")) {
      setEmailError(true)
      return
    }

    const studentID = updateFormData.studentid;

    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/student/${studentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateFormData)
      });
      if (response.ok) {
        // Handle success
        fetch('https://oregon-state-student-database-aws-render.onrender.com/student')
          .then(response => response.json())
          .then(data => setStudentData(data))
          .catch(error => console.error('Error fetching data:', error));
        setUpdateForm(!updateform)
      }
    } catch (error) {
      console.error('Could not update student', error);
    }
  };

  // The delete operation for the following student table
  const deleteStudent = async (studentID) => {
    setUpdateForm(false)
    setForm(false)
    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/student/${studentID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Student deleted successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/student')
          .then(response => response.json())
          .then(data => setStudentData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };


  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
          <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Student
          </button>
          {form && (
            <>
              <h1>Add Student </h1>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={handleSubmit}>
                    Fields marked * are required
                    <Form.Group className="mb-2" style={{ marginTop: "20px" }}>
                      <Form.Label> studentID* </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Student ID"
                        name="studentid"
                        value={formData.studentid}
                        onChange={handleChange}
                      />
                      <Form.Text style={{ color: "whitesmoke" }}>
                        Please enter the student's 6 digit ID listed on their
                        OSU portal. ex.726382
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Name*</Form.Label>
                      <Form.Control type="text" placeholder="Name" name="name"
                        value={formData.name}
                        onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control type="text" placeholder="Email" name="email"
                        value={formData.email}
                        onChange={handleChange} />
                    </Form.Group>
                    {emailError && (<p>Email needs to end in @oregonstate.edu</p>)}
                    <Form.Group className="mb-2">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as="select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="X">Intersex</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Current Company</Form.Label>
                      <Form.Control as="select" placeholder="Company" name="company"
                        value={formData.company}
                        onChange={handleChange}>
                        <option value=""></option>
                        {companies.map(company => (
                          <option key={company.companyID} value={company.companyID}>
                            {company.companyID}:{company.companyName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Previous Major</Form.Label>
                      <Form.Control type="text" placeholder="Major" name="previousMajor"
                        value={formData.previousMajor}
                        onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Graduated? (Yes/No)</Form.Label>
                      <Form.Control
                        as="select"
                        name="graduated"
                        value={formData.graduated}
                        onChange={handleChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Add student
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          {updateform == 1 && (
            <>
              <h1>Update Student </h1>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={updateStudent}>
                    Fields marked * are required
                    <Form.Group className="mb-2" style={{ marginTop: "20px" }}>
                      <Form.Label> studentID* </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Student ID"
                        name="studentid"
                        value={updateFormData.studentid}
                        onChange={handleUpdateChange}
                      />
                      <Form.Text style={{ color: "whitesmoke" }}>
                        Please enter the student's 6 digit ID THAT MATCHES the below
                        table for the row you want to update.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Name*</Form.Label>
                      <Form.Control type="text" placeholder="Name" name="name"
                        value={updateFormData.name}
                        onChange={handleUpdateChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control type="text" placeholder="Email" name="email"
                        value={updateFormData.email}
                        onChange={handleUpdateChange} />
                    </Form.Group>
                    {emailError && (<p>Email needs to end in @oregonstate.edu</p>)}
                    <Form.Group className="mb-2">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as="select"
                        name="gender"
                        value={updateFormData.gender}
                        onChange={handleUpdateChange}
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="X">Intersex</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Current Company</Form.Label>
                      <Form.Control as="select" placeholder="Company" name="company"
                        value={updateFormData.company}
                        onChange={handleUpdateChange}>
                        <option value=""></option>
                        {companies.map(company => (
                          <option key={company.companyID} value={company.companyID}>
                            {company.companyID}:{company.companyName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Previous Major</Form.Label>
                      <Form.Control type="text" placeholder="Major" name="previousMajor"
                        value={updateFormData.previousMajor}
                        onChange={handleUpdateChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Graduated? (Yes/No)</Form.Label>
                      <Form.Control
                        as="select"
                        name="graduated"
                        value={updateFormData.graduated}
                        onChange={handleUpdateChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Update student
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>studentID#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Company</th>
                <th>Previous Major</th>
                <th>Graduated?</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (<tr>
                <td>{student.studentID}</td>
                <td>{student.studentName}</td>
                <td>{student.studentEmail}</td>
                <td>{student.studentGender}</td>
                <td>{student.companyID}</td>
                <td>{student.previousMajor}</td>
                <td>{student.graduated}</td>
                <td>
                  <Button variant="primary" type="submit" onClick={() => changeForms(student)}>
                    +
                  </Button>
                </td>
                <td>
                  <Button variant="danger" type="submit" onClick={() => deleteStudent(student.studentID)}>
                    X
                  </Button>
                </td>
              </tr>))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </section>
  );
}

export default Student;
