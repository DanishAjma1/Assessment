import { Route, Routes } from "react-router-dom";
import SignUpAndSignIn from "../pages/auth/signInAndSignUp.js";
import Home from "../pages/home.js";
import Material from "../pages/instructor/material.js";
import ProtectedRoutes from "./protectedRoutes.js";
import CourseForm from "../pages/instructor/course.js";
import LiveSessionForm from "../pages/instructor/live-session.js";
import Courses from "../pages/student/courses.js";
import CourseData from "../pages/student/course-data.js";
import Notauthorized from "../pages/not-authorized.js";
import ChoiceToSignIn from "../pages/auth/choiceToSignIn.js";
export default function AllRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<SignUpAndSignIn />} path="/auth/signupandsignin" />
        <Route element={<Home />} path="/" />
        <Route element={<ProtectedRoutes allowedRole={"instructor"} />}>
          <Route element={<Material />} path="/instructor/material" />
          <Route element={<CourseForm />} path="/instructor/create-course" />
          <Route
            element={<LiveSessionForm />}
            path="/instructor/live-session"
          />
        </Route>
        {/* <Route element={<ProtectedRoutes />}> */}
          <Route element={<ChoiceToSignIn />} path="/choosetosignin" />
        {/* </Route> */}
        <Route element={<ProtectedRoutes allowedRole={"student"} />}>
          <Route element={<Courses />} path="/student/courses" />
          <Route element={<CourseData />} path="/student/course-data" />
        </Route>
        <Route element={<Notauthorized />} path="/not-authorized" />
      </Routes>
    </div>
  );
}
