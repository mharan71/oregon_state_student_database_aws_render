/*
Citation for the following CORS policy:
Date: 2/14/2023
Using Node.js requires a CORS policy to send data between frontend/backend to be read
Source URL: https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express
*/

/*
Citation for the basic starter code setup for backend:
Date: 2/14/2023
Basic backend setup using Michael Curry's example code in Week 1: Activity 2
Source URL: https://canvas.oregonstate.edu/courses/1946034/modules
*/

/*
SETUP
*/


require('dotenv').config(); // Load environment variables from .env file
var mysql = require('mysql');
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = process.env.PORT || 4283; // Set a port number at the top so it's easy to change in the future

// Set up database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cors to read data
var cors = require('cors');
app.use(cors());

/*
ROUTES
*/


/*
GET ROUTES
*/
// Gets student data
app.get('/student', (req, res) => {
  const query = 'SELECT * FROM Students';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Gets company data
app.get('/company', (req, res) => {
  const query = 'SELECT * FROM Companies';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Gets course data
app.get('/course', (req, res) => {
  const query = 'SELECT * FROM Courses';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Gets review data
app.get('/review', (req, res) => {
  const query = 'SELECT * FROM Reviews';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Gets student data
app.get('/earning', (req, res) => {
  const query = 'SELECT * FROM FinancialEarnings';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});


// Get Instructor Data
app.get('/instructor', (req, res) => {
  const query = 'SELECT * FROM Instructors';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Get enrollment Data
app.get('/enrollment', (req, res) => {
  const query = 'SELECT * FROM Enrollments';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});



/*
Post routes
*/
// Add a student
app.post("/student", (req, res) => {
  const { studentid, name, email, gender, company, previousMajor, graduated } = req.body;
  const q = `INSERT INTO Students (studentID, studentName, studentEmail, studentGender, companyID, previousMajor, graduated) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [studentid, name, email, gender, company, previousMajor, graduated];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Student added successfully');
    res.status(200).json({ message: 'Student added successfully' });
  });
});

// Add a review
app.post("/review", (req, res) => {
  const { courseid, unit, feedback } = req.body;
  const q = `INSERT INTO Reviews (courseID, courseRating, courseReview) VALUES (?, ?, ?)`;
  const values = [courseid, unit, feedback];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Review added successfully');
    res.status(200).json({ message: 'Review added successfully' });
  });
});

// Add an earning
app.post("/earning", (req, res) => {
  const { prev, tuition, loan, misc, interest, studentID, current } = req.body;
  const q = `INSERT INTO FinancialEarnings (priorSalary, tuitionCost, studentLoan,
    miscExpense,loanInterest,studentID, newSalary) VALUES (?, ?, ?, ? ,? ,? ,?)`;
  const values = [prev, tuition, loan, misc, interest, studentID, current];
  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Earning added successfully');
    res.status(200).json({ message: 'Earning added successfully' });
  });
});

// Add Instructor Data
app.post("/instructor", (req, res) => {
  const { instructorName, instructorEmail, instructorGender, instructorQualifications, yearsTaught } = req.body;
  const q = `INSERT INTO Instructors (instructorName, instructorEmail, instructorGender, instructorQualifications, yearsTaught) VALUES (?, ?, ?, ?, ?)`;
  const values = [instructorName, instructorEmail, instructorGender, instructorQualifications, yearsTaught];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Instructor added successfully');
    res.status(200).json({ message: 'Instructor added successfully' });
  });
});

// Add company data
app.post("/company", (req, res) => {
  const { companyID, companyName, role } = req.body;
  const q = `INSERT INTO Companies (companyID, companyName, role) VALUES (?, ?, ?)`;
  const values = [companyID, companyName, role];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Company added successfully');
    res.status(200).json({ message: 'Company added successfully' });
  });
});

// Add course data
app.post("/course", (req, res) => {
  const { courseID, courseName, description, courseUnits, instructorID } = req.body;
  const q = `INSERT INTO Courses (courseID, courseName, description, courseUnits, instructorID) VALUES (?, ?, ?, ?, ?)`;
  const values = [courseID, courseName, description, courseUnits, instructorID];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Course added successfully');
    res.status(200).json({ message: 'course added successfully' });
  });
});

// Add enrollment data
app.post("/enrollment", (req, res) => {
  const { studentid, courseid } = req.body;
  const q = `INSERT INTO Enrollments (studentID, courseID) VALUES (?, ?)`;
  const values = [studentid, courseid];

  pool.query(q, values, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
      return;
    }
    console.log('Enrollment added successfully');
    res.status(200).json({ message: 'Enrollment added successfully' });
  });
});




/*
UPDATE Routes
*/
// Update Student
app.put("/student/:studentID", (req, res) => {
  const { name, email, gender, company, previousMajor, graduated } = req.body;
  const studentID = req.params.studentID;

  const q = `UPDATE Students SET studentName = ?, studentEmail = ?, studentGender = ?, companyID = ?, 
             previousMajor = ?, graduated = ? WHERE studentID = ?`;

  pool.query(q, [name, email, gender, company, previousMajor, graduated, studentID], (err, result) => {
    if (err) {
      console.error('Error updating student:', err);
      res.status(500).json({ error: 'Failed to update student' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send(`Could not locate student with studentID of ${studentID}.`);
      return;
    }
    console.log('Student updated successfully');
    res.status(200).json({ message: 'Student updated successfully' });
  });
});

// Update review
app.put("/review/:reviewID", (req, res) => {
  const { courseid, unit, feedback } = req.body;
  const reviewID = req.params.reviewID;
  const converted_reviewID = parseInt(reviewID, 10)

  const q = `UPDATE Reviews SET courseID = ?, courseRating = ?, courseReview = ? WHERE reviewID = ?`;

  pool.query(q, [courseid, unit, feedback, converted_reviewID], (err, result) => {
    if (err) {
      console.error('Error updating review:', err);
      res.status(500).json({ error: 'Failed to update review' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send(`Could not locate review with reviewID of ${reviewID}.`);
      return;
    }
    console.log('Review updated successfully');
    res.status(200).json({ message: 'Review updated successfully' });
  });
});

// Update earning
app.put("/earning/:earningID", (req, res) => {
  const { prev, tuition, loan, misc, interest, studentID, current } = req.body;
  const q = `UPDATE FinancialEarnings SET priorSalary = ?, tuitionCost = ?, studentLoan = ?,
  miscExpense = ?,loanInterest = ?,studentID =?, newSalary =? WHERE earningsID = ?`;

  const earningID = req.params.earningID;
  pool.query(q, [prev, tuition, loan, misc, interest, studentID, current, earningID], (err, result) => {
    if (err) {

      console.error('Error updating earning:', err);
      res.status(500).json({ error: 'Failed to update earning' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send(`Could not locate earning with earning of ${earningID}.`);
      return;
    }
    console.log('Earning updated successfully');

    res.status(200).json({ message: 'Earning updated successfully' });
  });
});

//Update enrollment
app.put("/enrollment/:enrollmentID", (req, res) => {
  const { studentid, courseid } = req.body;
  const q = `UPDATE Enrollments SET studentID = ?, courseID = ? WHERE enrollmentID = ? `;

  const enrollmentID = req.params.enrollmentID;
  pool.query(q, [studentid, courseid, enrollmentID], (err, result) => {
    if (err) {

      console.error('Error updating enrollment:', err);
      res.status(500).json({ error: 'Failed to update enrollment' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send(`Could not locate enrollment.`);
      return;
    }
    console.log('enrollment updated successfully');

    res.status(200).json({ message: 'enrollment updated successfully' });
  });
});




/*
DELETE ROUTES
*/

//Delete student
app.delete('/student/:studentID', (req, res) => {
  const studentID = req.params.studentID;
  const q = 'DELETE FROM Students WHERE studentID = ?';

  pool.query(q, [studentID], (err) => {
    if (err) {
      console.error('Error deleting student:', err);
      res.status(500).json({ error: 'Failed to delete student' });
      return;
    }
    console.log('Student deleted successfully');
    res.sendStatus(204); // No content - deletion successful
  });
});

// Delete a review with the given reviewID
app.delete('/review/:reviewID', (req, res) => {
  const reviewID = req.params.reviewID;
  const q = 'DELETE FROM Reviews WHERE reviewID = ?';

  pool.query(q, [reviewID], (err) => {
    if (err) {
      console.error('Error deleting review:', err);
      res.status(500).json({ error: 'Failed to delete review' });
      return;
    }
    console.log('Review deleted successfully');
    res.sendStatus(204); // No content - deletion successful
  });
});

//Delete an earning with the given earningID
app.delete('/earning/:earningID', (req, res) => {
  const earningID = req.params.earningID;
  const q = 'DELETE FROM FinancialEarnings WHERE earningsID = ?';

  pool.query(q, [earningID], (err) => {
    if (err) {
      console.error('Error deleting earning:', err);
      res.status(500).json({ error: 'Failed to delete earning' });
      return;
    }
    console.log('Earning deleted successfully');
    res.sendStatus(204); // No content - deletion successful
  });
});

// Delete Course
app.delete('/course/:courseID', (req, res) => {
  const courseID = req.params.courseID;
  const q = 'DELETE FROM Courses WHERE courseID = ?';

  pool.query(q, [courseID], (err) => {
    if (err) {
      console.error('Error deleting course:', err);
      res.status(500).json({ error: 'Failed to delete course' });
      return;
    }
    console.log('Courses deleted successfully');
    res.sendStatus(204); // No content - deletion successful
  });
});

// Delete Enrollment
app.delete('/enrollment/:enrollmentID', (req, res) => {
  const enrollmentID = req.params.enrollmentID;
  const q = 'DELETE FROM Enrollments WHERE enrollmentID = ?';

  pool.query(q, [enrollmentID], (err) => {
    if (err) {
      console.error('Error deleting enrollment:', err);
      res.status(500).json({ error: 'Failed to delete enrollment' });
      return;
    }
    console.log('Enrollment deleted successfully');
    res.sendStatus(204); // No content - deletion successful
  });
});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});