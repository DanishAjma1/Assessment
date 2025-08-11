import { Route, Routes } from "react-router-dom";
import SignUpAndSignIn from "../pages/auth/signInAndSignUp.js";
import Home from "../pages/home.js";
export default function AllRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<SignUpAndSignIn />} path="/auth/signupandsignin" />
        <Route element={<Home />} path="/" />
      </Routes>
    </div>
  );
}
