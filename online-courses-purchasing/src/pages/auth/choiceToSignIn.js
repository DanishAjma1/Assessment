import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChoiceToSignIn() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <h2 className="text-3xl font-medium my-5">Sign in as a </h2>
      <div className="flex bg-white justify-center w-8/12 h-80 rounded-md overflow-hidden gap-5">
        <div
          className="text-3xl w-1/2 bg-gray-500 flex items-center justify-center font-semibold rounded-md shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            navigate("/auth/signupandsignin", { state: { role: "student" } });
          }}
        >
          Sign in as a Student
        </div>
        <div
          className="text-3xl w-1/2 bg-gray-700  flex items-center justify-center font-semibold rounded-md shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            navigate("/auth/signupandsignin", {
              state: { role: "instructor" },
            });
          }}
        >
          Sign in as a Instructor
        </div>
      </div>
    </div>
  );
}
