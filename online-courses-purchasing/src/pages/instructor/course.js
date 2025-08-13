import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CourseForm() {
  const [courses, setCourses] = useState([]);
  const url = "http://localhost:5000";
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(url + "/instructor/get-courses-for-instructor", {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data));
  }, []);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(url + "/instructor/create-course", course, {
        withCredentials: true,
      });
      alert("Course created successfully!");
      setCourse({ title: "", description: "", instructor: "", price: "" });
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center items-center"
      >
        <h2 className="mt-5 text-2xl font-bold">Create Course</h2>

        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={course.price}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-3 py-1 rounded-md shadow-sm"
        >
          Create Course
        </button>
      </form>
      <div className="flex p-4 flex-col">
        <h2 className="text-lg font-bold mt-10">
          All Courses which are uploaded by you..
        </h2>
        <ul className="gap-3 flex flex-col text-start mt-5">
          {courses.map((c) => (
            <div className="bg-gray-300 shadow-md p-4 rounded-md">
              <li key={c._id}>
                <h3>Title:{c.title}</h3>
                <p>Description: {c.description}</p>
                <p>Price: ${c.price}</p>
              </li>
              <div className="gap-4 flex p-4 ">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem("course");
                    localStorage.setItem("course",JSON.stringify(c))
                    navigate("/instructor/material");
                  }}
                >
                  Check Material
                </button>

                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-md shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/instructor/live-session", { state: { course: c } });
                  }}
                >
                  Manage live Session
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
