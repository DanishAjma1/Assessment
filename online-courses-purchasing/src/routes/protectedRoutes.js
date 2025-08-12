import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ allowedRole }) {
  const url = "http://localhost:5000";
  const navigate = useNavigate();
  const [isAuthentic, setIsAuthentic] = useState(null);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const checkUser = async () => {
      await axios
        .get(url + "/isuserloggedin", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) setIsAuthentic(true);
          const {user} = response.data;
          setRole(user.role);
          console.log("User is logged in");
        })
        .catch((error) => {
          setIsAuthentic(false);
          console.log(error.message);
          navigate("/auth/signupandsignin",{state:{role:role}});
        });
    };
    checkUser();
  }, []);
  if (isAuthentic === null) {
    return <div>loading....</div>;
  }
  if (!isAuthentic) {
    return (
      <Navigate to="/" replace />
    );
  }
  if (isAuthentic && role !== allowedRole) {
    return <Navigate to={"/not-authorized"} replace />;
  }
  if (isAuthentic) {
    return <Outlet />;
  }
}
