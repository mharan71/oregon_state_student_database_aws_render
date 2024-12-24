/*Import basic react hooks and router */
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Component webpages to import */
import Homepage from './Components/Homepage.js';
import Navigation from './Components/Navigation.js';
import Students from './Components/Students.js';
import Courses from './Components/Courses.js';
import Instructors from "./Components/Instructors.js"
import Companies from "./Components/Companies.js"
import Reviews from "./Components/Reviews.js"
import FinancialEarnings from "./Components/FinancialEarnings.js"
import Enrollments from "./Components/Enrollments.js"

/*Import bootstrap styles */
import 'bootstrap/dist/css/bootstrap.min.css';

/*
Citation for the following react library:
Date: 2/14/2023
Based on React-Bootstrap library for styling, easier component building:
The following components were imported: Container,Row,Col,Form,Nav,Navbar,Button
Source URL: https://react-bootstrap.github.io/
*/

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation/>
        <Routes>
          <Route path = "/" element= {<Homepage />}/>
          <Route path = "/student" element= {<Students />}/>
          <Route path = "/course" element= {<Courses />}/>
          <Route path = "/instructor" element= {<Instructors />}/>
          <Route path = "/company" element= {<Companies />}/>
          <Route path = "/review" element= {<Reviews />}/>
          <Route path = "/earning" element= {<FinancialEarnings />}/>
          <Route path = "/enrollment" element= {<Enrollments />}/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;
