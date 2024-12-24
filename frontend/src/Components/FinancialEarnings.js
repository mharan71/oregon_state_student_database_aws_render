import React, { useState, useEffect } from "react";

/*Import components from react-bootstrap */
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import InputGroup from 'react-bootstrap/InputGroup';

/*
Citation for the following react library:
Date: 2/14/2023
Based on React-Bootstrap library for styling, easier component building:
The following components were imported: Container,Row,Col,Form,Nav,Navbar,Button
Source URL: https://react-bootstrap.github.io/
*/

function FinancialEarnings() {
  const [form, setForm] = useState(false);
  const [updateform, setUpdateForm] = useState(false);
  // The earning data which is pulled for the backend 
  const [earnings, setEarningData] = useState([]);
  // The student data which is pulled for the backend 
  const [students, setStudentData] = useState([]);

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/earning')
      .then(response => response.json())
      .then(data => setEarningData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/student')
      .then(response => response.json())
      .then(data => setStudentData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Form data which is a useState object
  // Note some fields are set to the default values if not selected
  const [formData, setFormData] = useState({
    prev: '',
    tuition: '',
    loan: '',
    misc: '',
    interest: '',
    studentID: '',
    current: ''
  });

  const [updateFormData, setUpdateFormData] = useState({
    earningID: '',
    prev: '',
    tuition: '',
    loan: '',
    misc: '',
    interest: '',
    studentID: '',
    current: ''
  });

  const changeForms = (earning) => {
    setForm(false)
    setUpdateForm(!updateform)
    setUpdateFormData({
      earningID: earning.earningsID,
      prev: earning.priorSalary,
      tuition: earning.tuitionCost,
      loan: earning.studentLoan,
      misc: earning.miscExpense,
      interest: earning.loanInterest,
      studentID: earning.studentID,
      current: earning.newSalary
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

  // On submit prevent webpage reload and check conditions
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://oregon-state-student-database-aws-render.onrender.com/earning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Earning added successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/earning')
          .then(response => response.json())
          .then(data => setEarningData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add earning', error);
    }
  };

  const checkEmptyUpdate = () => {
    for (const field in updateFormData) {
      if (updateFormData[field] === '') {
        alert('One or more of your fields are still empty. Please fill it out.')
        return
      }
    }
  }

  const updateEarning = async (e) => {
    e.preventDefault();

    const earningID = updateFormData.earningID;

    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/earning/${earningID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateFormData)
      });
      if (response.ok) {
        // Handle success
        fetch('https://oregon-state-student-database-aws-render.onrender.com/earning')
          .then(response => response.json())
          .then(data => setEarningData(data))
          .catch(error => console.error('Error fetching data:', error));
        setUpdateForm(!updateform)
      }
    } catch (error) {
      console.error('Could not update earning', error);
    }
  };

  // Course function to find the following name of the student corresponding to ID;
  const getStudent = (studentid) => {
    // Iterates through all students checking if studentd matches form studentid
    const student = students.find(student => student.studentID === studentid)
    // COURSE(IF TRUE, ELSE FALSE): TRUE VALUE : FALSE VALUE
    return student ? student.studentID : null;
  }

  // The delete operation for the following earning table
  const deleteEarning = async (earningID) => {
    setUpdateForm(false)
    setForm(false)

    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/earning/${earningID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Earning deleted successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/earning')
          .then(response => response.json())
          .then(data => setEarningData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Error deleting earning:', error);
    }
  };

  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
          <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Financial Earning
          </button>
          {form && (
            <>
              <h1>Add Financial Earnings </h1>
              <h2>* Fields are required
              </h2>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={handleSubmit}>
                    <Form.Label>Previous Salary</Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="prev"
                        value={formData.prev}
                        onChange={handleChange}
                        aria-label="Amount (to the nearest dollar)"
                      />
                    </InputGroup>
                    <Form.Text style={{ color: "whitesmoke" }}>
                      What was your previous salary before enrolling in OSU if
                      possible?
                    </Form.Text>
                    <Form.Label>Tuition Cost</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="tuition"
                        value={formData.tuition}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <Form.Label>Student Total Loans</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="loan"
                        value={formData.loan}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <Form.Label>Misc. Expenses</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="misc"
                        value={formData.misc}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <Form.Label>Loan Interest</Form.Label>
                    <InputGroup className="mb-3">

                      <Form.Control
                        placeholder="Enter Interest %"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <Form.Group className="mb-2">
                      <Form.Label> StudentID * (SELECT from dropdown)</Form.Label>
                      <Form.Control
                        as="select"
                        placeholder="Enter StudentID Number"
                        name="studentID"
                        value={formData.studentID}
                        onChange={handleChange}
                      >
                        <option value=""></option>
                        {students.map(student => (
                          <option key={student.studentID} value={student.studentID}>
                            {student.studentID}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Text style={{ color: "whitesmoke" }}>
                        Click the input box to make the dropdown appear.
                      </Form.Text>
                    </Form.Group>

                    <Form.Label>Current Salary</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="current"
                        value={formData.current}
                        onChange={handleChange}
                      />
                      <Form.Text style={{ color: "whitesmoke" }}>
                        What is your new salary after or currently enrolling in OSU if
                        possible?
                      </Form.Text>
                    </InputGroup>
                    <Button variant="primary" type="submit">
                      Add
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          {updateform && (
            <>
              <h1>Update Financial Earnings </h1>
              <h2>Update Financial Information based on ID clicked.</h2>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={updateEarning}>
                    <Form.Group className="mb-2">
                      <Form.Text style={{ color: "whitesmoke" }}>
                        The earningID you selected was: {updateFormData.earningID}
                      </Form.Text>
                    </Form.Group>
                    <Form.Label>Previous Salary</Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="prev"
                        value={updateFormData.prev}
                        onChange={handleUpdateChange}
                        aria-label="Amount (to the nearest dollar)"
                      />

                    </InputGroup>
                    <Form.Text style={{ color: "whitesmoke" }}>
                      What was your previous salary before enrolling in OSU if
                      possible?
                    </Form.Text>
                    <Form.Label>Tuition Cost</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="tuition"
                        value={updateFormData.tuition}
                        onChange={handleUpdateChange}
                      />
                    </InputGroup>

                    <Form.Label>Student Total Loans</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="loan"
                        value={updateFormData.loan}
                        onChange={handleUpdateChange}
                      />
                    </InputGroup>

                    <Form.Label>Misc. Expenses</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="misc"
                        value={updateFormData.misc}
                        onChange={handleUpdateChange}
                      />
                    </InputGroup>

                    <Form.Label>Loan Interest</Form.Label>
                    <InputGroup className="mb-3">

                      <Form.Control
                        placeholder="Enter Interest %"
                        name="interest"
                        value={updateFormData.interest}
                        onChange={handleUpdateChange}
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>

                    <Form.Group className="mb-2">
                      <Form.Label> StudentID* (SELECT from dropdown)</Form.Label>
                      <Form.Control
                        as="select"
                        placeholder="Enter StudentID Number"
                        name="studentID"
                        value={updateFormData.studentID}
                        onChange={handleUpdateChange}
                      >
                        <option value=""></option>
                        {students.map(student => (
                          <option key={student.studentID} value={student.studentID}>
                            {student.studentID}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Text style={{ color: "whitesmoke" }}>
                        Click the input box to make the dropdown appear.
                      </Form.Text>
                    </Form.Group>

                    <Form.Label>Current Salary</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter Dollar Amount"
                        name="current"
                        value={updateFormData.current}
                        onChange={handleUpdateChange}
                      />
                      <Form.Text style={{ color: "whitesmoke" }}>
                        What is your new salary after or currently enrolling in OSU if
                        possible?
                      </Form.Text>
                    </InputGroup>
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>earningsID#</th>
                <th>Previous Salary</th>
                <th>Tuition Cost</th>
                <th>Student Loans</th>
                <th>Misc. Expenses</th>
                <th>Loan Interest</th>
                <th>Student ID</th>
                <th>Current Salary</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map(earning => (
                <tr>
                  <td>{earning.earningsID}</td>
                  <td>${earning.priorSalary}</td>
                  <td>${earning.tuitionCost}</td>
                  <td>${earning.studentLoan}</td>
                  <td>${earning.miscExpense}</td>
                  <td>{earning.loanInterest}%</td>
                  <td>{getStudent(earning.studentID)}</td>
                  <td>${earning.newSalary}</td>
                  <td>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={() => changeForms(earning)}
                    >
                      +
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      type="submit"
                      onClick={() => deleteEarning(earning.earningsID)}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </section >
  );
}

export default FinancialEarnings;
