import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const url = "http://localhost:5000";
  return (
    <div className="flex justify-around">
      <nav className="flex justify-center">
        <ul className="gap-5 flex p-2">
          <li>
            <Link
              className="text-lg p-2 underline-offset-8 underline hover:text-yellow-800"
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-lg p-2 underline-offset-8 underline hover:text-yellow-800"
              to="/instructor/create-course"
            >
              Create courses
            </Link>
          </li>
          <li>
            <Link
              className="text-lg p-2 underline-offset-8 underline hover:text-yellow-800"
              to="/student/courses"
            >
              My Courses
            </Link>
          </li>
          <li>
            <Link
              className="text-lg p-2 underline-offset-8 underline hover:text-yellow-800"
              to="/choosetosignin"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
      <button
        className="flex bg-red-500 px-3 mt-2 py-1 rounded-md text-lg"
        onClick={async (e) => {
          e.preventDefault();
          await axios.get(url + "/auth/logout", {
            withCredentials: true,
          });
          alert("logged out");
          navigate("choosetosignin");
        }}
      >
        logout
      </button>
    </div>
  );
}
