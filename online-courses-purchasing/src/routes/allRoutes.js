import { Route, Routes } from "react-router-dom";
import SignUpAndSignIn from "../pages/auth/signInAndSignUp.js";
import Home from "../pages/home.js";
import Material from "../pages/instructor/material.js";
import ProtectedRoutes from "./protectedRoutes.js";
import CourseForm from "../pages/instructor/course.js";
import LiveSessionForm from "../pages/instructor/live-session.js";
export default function AllRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<SignUpAndSignIn />} path="/auth/signupandsignin" />
        <Route element={<Home />} path="/" />
        <Route element={<ProtectedRoutes />} path="/pro" />
        <Route element={<ProtectedRoutes allowedRole={"instructor"} />}>
          <Route element={<Material />} path="/instructor/material" />
          <Route element={<CourseForm />} path="/instructor/create-course" />
          <Route
            element={<LiveSessionForm />}
            path="/instructor/live-session"
          />
        </Route>
      </Routes>
    </div>
  );
}
