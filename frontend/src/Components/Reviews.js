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

function Reviews() {
  const [form, setForm] = useState(false);
  const [updateform, setUpdateForm] = useState(false);
  // The review data which is pulled for the backend 
  const [reviews, setReviewData] = useState([]);
  // The review data which is pulled for the backend 
  const [courses, setCourseData] = useState([]);

  // Side effect for loading component after each render
  // Data is loaded once on load 
  useEffect(() => {
    fetch('https://oregon-state-student-database-aws-render.onrender.com/review')
      .then(response => response.json())
      .then(data => setReviewData(data))
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
    courseid: '',
    unit: '1',
    feedback: '',
  });

  const [updateFormData, setUpdateFormData] = useState({
    courseid: '',
    unit: '1',
    feedback: '',
  });

  const changeForms = (review) => {
    setForm(false)
    setUpdateForm(!updateform)
    setUpdateFormData({
      reviewid: review.reviewID,
      courseid: review.courseID,
      unit: review.courseRating,
      feedback: review.courseReview,
    })
    return
  }

  // handleChange arrow function called everytime a field is filled out
  // Destructure e.target which has name,target
  // update state with the previous formData object and new attribute:value pair
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "courseid" || name == "unit") {
      let intValue = parseInt(value, 10);
      setFormData({ ...formData, [name]: intValue })
      return
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name == "courseid" || name == "unit") {
      let intValue = parseInt(value, 10);
      setUpdateFormData({ ...updateFormData, [name]: intValue })
      return
    }
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

  // Course function to find the following name of the course corresponding to ID;
  const findCourse = (courseid) => {
    // Iterates through all courses checking if courseid matches form courseid
    const course = courses.find(course => course.courseID === courseid)
    // COURSE(IF TRUE, ELSE FALSE): TRUE VALUE : FALSE VALUE
    return course ? course.courseName : null;
  }

  // On submit prevent webpage reload and check conditions
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://oregon-state-student-database-aws-render.onrender.com/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log('Review added successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/review')
          .then(response => response.json())
          .then(data => setReviewData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Could not add review', error);
    }
  };


  // Update the review table
  // The following method prevents window reload on submit
  // And updates the id selected
  const updateReview = async (e) => {
    e.preventDefault();

    const reviewID = updateFormData.reviewid;

    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/review/${reviewID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateFormData)
      });
      if (response.ok) {
        // Handle success
        fetch('https://oregon-state-student-database-aws-render.onrender.com/review')
          .then(response => response.json())
          .then(data => setReviewData(data))
          .catch(error => console.error('Error fetching data:', error));
        setUpdateForm(!updateform)
      }
    } catch (error) {
      console.error('Could not update review', error);
    }
  };

  // The delete operation for the following review table
  // Deletes the entry with the given id and resets form views
  const deleteReview = async (reviewID) => {
    setUpdateForm(false)
    setForm(false)
    try {
      const response = await fetch(`https://oregon-state-student-database-aws-render.onrender.com/review/${reviewID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Review deleted successfully');
        fetch('https://oregon-state-student-database-aws-render.onrender.com/review')
          .then(response => response.json())
          .then(data => setReviewData(data))
          .catch(error => console.error('Error fetching data:', error));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <section>
      <Container fluid className="basic-info" id="student">
        <Container className="content">
          <button type="button" class="btn btn-dark" onClick={() => setForm(!form)}>
            Add Review
          </button>
          {form && (
            <>
              <h1>Add Review</h1>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Label> Course Number (Select from Dropdown) </Form.Label>
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
                    <Form.Group className="mb-2">
                      <Form.Label>Rating (Out of 10)</Form.Label>
                      <select class="form-control" type="number" id="unit" value={formData.unit}
                        onChange={handleChange} name="unit">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                      <Form.Text style={{ color: "whitesmoke" }}>
                        On a scale of 1 to 10, where 10 is excellent and 1 is
                        bad, how would you rate this course?
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-5">
                      <Form.Label>Course Review</Form.Label>
                      <div class="form-group">
                        <textarea
                          class="form-control"
                          id="Text-description"
                          placeholder="Review for this course..."
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleChange}
                          rows="3"
                        ></textarea>
                        <Form.Text style={{ color: "whitesmoke" }}>
                          How was this course beneficial in your job search.
                        </Form.Text>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Add review
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          {updateform == 1 && (
            <>
              <h1>Update Review</h1>
              <Row>
                <Col md={7}>
                  <Form className="form-box" onSubmit={updateReview}>
                    <Form.Group className="mb-2">
                      <Form.Text style={{ color: "whitesmoke" }}>
                        The reviewID you selected was: {updateFormData.reviewid}
                      </Form.Text>
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
                    <Form.Group className="mb-2">
                      <Form.Label>Rating (Out of 10)</Form.Label>
                      <select class="form-control" type="number" id="unit" value={updateFormData.unit}
                        onChange={handleUpdateChange} name="unit">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                      <Form.Text style={{ color: "whitesmoke" }}>
                        On a scale of 1 to 10, where 10 is excellent and 1 is
                        bad, how would you rate this course?
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-5">
                      <Form.Label>courseReview</Form.Label>
                      <div class="form-group">
                        <textarea
                          class="form-control"
                          id="Text-description"
                          placeholder="Review for this course..."
                          rows="3"
                          name="feedback"
                          value={updateFormData.feedback}
                          onChange={handleUpdateChange}
                        ></textarea>
                        <Form.Text style={{ color: "whitesmoke" }}>
                          How was this course beneficial in your job search.
                        </Form.Text>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Update review
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>reviewID#</th>
                <th>Course</th>
                <th>Course #</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (<tr>
                <td>{review.reviewID}</td>
                <td>{findCourse(review.courseID)}</td>
                <td>{review.courseID}</td>
                <td>{review.courseRating}</td>
                <td>{review.courseReview}</td>
                <td>
                  <Button variant="primary" type="submit" onClick={() => changeForms(review)}>
                    +
                  </Button>
                </td>
                <td>
                  <Button variant="danger" type="submit" onClick={() => deleteReview(review.reviewID)}>
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

export default Reviews;
