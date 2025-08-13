import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const url = "http://localhost:5000";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      await axios
        .get(url + "/instructor/get-courses-for-student", {
          withCredentials: true,
        })
        .then((res) => setCourses(res.data));
    };
    fetchCourses();
  }, []);
  console.log(courses);
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex p-4 flex-col w-1/3">
        <h2 className="text-lg font-bold mt-10">
          All Courses Associated to you..
        </h2>
        <ul className="gap-3 flex flex-col text-start mt-5">
          {courses.map((c) => (
            <div key={c._id} className="bg-gray-300 shadow-md p-4 rounded-md">
              <li>
                <h3>Title:{c.course?.title}</h3>
                <p>Description: {c.course?.description}</p>
                <p>Price: ${c.course?.price}</p>
                <p>statusOfPurchase : {c.statusOfPurchase}</p>
              </li>
              <div className="flex justify-end my-5">
                <button
                  className="text-lg font-medium px-3 py-1 bg-green-600 text-white rounded-md"
                  onClick={async (e) => {
                    e.preventDefault();
                    await axios.post(
                      url + "/stripe/api/create-checkout-session",
                      { courseId: c._id },
                      { withCredentials: true }
                    );
                  }}
                >
                  Buy Now
                </button>
              </div>
              <div className="gap-4 flex p-4 ">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/student/course-data", { state: { course: c } });
                  }}
                >
                  Check Material
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
