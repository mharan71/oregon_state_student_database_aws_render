import React, { useState, useEffect } from 'react'

/*Import components from react-bootstrap */
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

function Enrollments() {
  const [form, setForm] = useState(false);
  const [updateform, setUpdateForm] = useState(false);
  // The student data which is pulled for the backend 
  const [students, setStudentData] = useState([]);
  // The course data which is pulled for the backend 
  const [courses, setCourseData] = useState([]);
  // The enrollment data which is pulled for the backend 
  const [enrollments, setEnrollmentData] = useState([]);

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/enrollment')
      .then(response => response.json())
      .then(data => setEnrollmentData(data))
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

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/course')
      .then(response => response.json())
      .then(data => setCourseData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Form data which is a useState object
  // Note some fields are set to the default values if not selected
  const [formData, setFormData] = useState({
    studentid: '',
    courseid: '',
  });

  const [updateFormData, setUpdateFormData] = useState({
    enrollmentID:'',
    studentid: '',
    courseid: '',
  });

  // handleChange arrow function called everytime a field is filled out
  // Destructure e.target which has name,target
  // update state with the previous formData object and new attribute:value pair
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // On submit prevent webpage reload and check conditions
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkEmpty()) {
      return
    }

    try {
      const response = await fetch('https://oregon-state-student-database-aws-render.onrender.com/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Enrollment added successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/enrollment')
          .then(response => response.json())
          .then(data => setEnrollmentData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add enrollment', error);
    }
  };

  // Change forms when updating an entry by hiding all other forms
  const changeForms = (enrollment) => {
    setForm(false)
    setUpdateForm(!updateform)
    setUpdateFormData({
      enrollmentid: enrollment.enrollmentID,
      studentid: enrollment.studentID,
      courseid: enrollment.courseID
    })
    return
  }

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

  // Course function to find the following name of the course corresponding to ID;
  const findCourse = (courseid) => {
    // Iterates through all courses checking if courseid matches form courseid
    const course = courses.find(course => course.courseID === courseid)
    // COURSE(IF TRUE, ELSE FALSE): TRUE VALUE : FALSE VALUE
    return course ? course.courseName : null;
  }

  // Student function to find the following name of the course corresponding to ID;
  const findStudent = (studentid) => {
    // Iterates through all student checking if courseid matches form studentid
    const student = students.find(student => student.studentID === studentid)
    // COURSE(IF TRUE, ELSE FALSE): TRUE VALUE : FALSE VALUE
    return student ? student.studentName : null;
  }

  // The delete operation for the following enrollment table
  const deleteEnrollment = async (enrollmentID) => {
    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/enrollment/${enrollmentID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Enrollment deleted successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/enrollment')
          .then(response => response.json())
          .then(data => setEnrollmentData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
    }
  };

  // Update the enrollment table
  const updateEnrollment = async (e) => {
    e.preventDefault();

    const enrollmentID = updateFormData.enrollmentid;

    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/enrollment/${enrollmentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateFormData)
      });
      if (response.ok) {
        // Handle success
        fetch('https://oregon-state-student-database-aws-render.onrender.com/enrollment')
          .then(response => response.json())
          .then(data => setEnrollmentData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
      setUpdateForm(false)
    } catch (error) {
      console.error('Could not update review', error);
    }
  };
  
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
        <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Enrollment
          </button>
          {form && (<><h1>Add Enrollment </h1>
            <h6>Please select the course you are taking from the list of available courses.</h6>
            <Row>
              <Col md={7}>
                <Form className="form-box" onSubmit={handleSubmit}>
                  <Form.Group className="mb-2">
                    <Form.Label> Student Name </Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Enter Student Number"
                      name="studentid"
                      value={formData.studentid}
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      {students.map(student => (
                        <option key={student.studentID} value={student.studentID}>
                          {student.studentID}:{student.studentName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label> Course Number </Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Enter Course Number"
                      name="courseid"
                      value={formData.courseid}
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      {courses.map(course => (
                        <option key={course.courseID} value={course.courseID}>
                          {course.courseID}:{course.courseName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                    Add enrollment
                  </Button>
                </Form>
              </Col>
            </Row>
          </>)}
          {updateform == 1 && (<><h1>Update Enrollment </h1>
            <h6>Please update the course or student you are clicking from the ID</h6>
            <Row>
              <Col md={7}>
                <Form className="form-box" onSubmit={updateEnrollment}>
                <Form.Group className="mb-2">
                    <Form.Text style={{ color: "whitesmoke" }}>
                        The ID you selected is {updateFormData.enrollmentid}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label> Student Name </Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Enter Student Number"
                      name="studentid"
                      value={updateFormData.studentid}
                      onChange={handleUpdateChange}
                    >
                      <option value=""></option>
                      {students.map(student => (
                        <option key={student.studentID} value={student.studentID}>
                          {student.studentID}:{student.studentName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label> Course Number </Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Enter Course Number"
                      name="courseid"
                      value={updateFormData.courseid}
                      onChange={handleUpdateChange}
                    >
                      <option value=""></option>
                      {courses.map(course => (
                        <option key={course.courseID} value={course.courseID}>
                          {course.courseID}:{course.courseName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                    Add enrollment
                  </Button>
                </Form>
              </Col>
            </Row>
          </>)}
          <h1>View Enrollment Info </h1>
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>enrollmentID#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (<tr>
                <td>{enrollment.enrollmentID}</td>
                <td>{findStudent(enrollment.studentID)}</td>
                <td>{findCourse(enrollment.courseID)}</td>
                <td>
                <Button variant="primary" type="submit" onClick={() => changeForms(enrollment)}>
                    +
                  </Button>
                </td>
                <td>
                  <Button variant="danger" type="submit" onClick={() => deleteEnrollment(enrollment.enrollmentID)}>
                    X
                  </Button>
                </td>
              </tr>))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </section>
  )
}

export default Enrollments