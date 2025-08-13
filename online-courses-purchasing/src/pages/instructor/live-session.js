import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function LiveSessionForm() {
  const [sessions, setSessions] = useState([]);
  let course = JSON.parse(localStorage.getItem("course"));
  const url = "http://localhost:5000";
  useEffect(() => {
    const fetchSessions = async () => {
      await axios
        .get(url + `/instructor/get-live-session/${course._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          const { sessions } = res.data;
          setSessions(sessions);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchSessions();
  }, []);

  const [session, setSession] = useState({
    course: course._id,
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSession({
      ...session,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(session);
      await axios.post(
        "http://localhost:5000/instructor/insert-live-session",
        session,
        {
          withCredentials: true,
        }
      );
      alert("Live Session created successfully!");
      setSession({
        course: course._id,
        date: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating live session");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  justify-center items-center gap-3 p-5"
      >
        <h2 className="text-2xl font-bold">Create Live Session</h2>
        <input
          className="flex text-lg p-2 rounded-md"
          type="date"
          name="date"
          value={session.date}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="flex px-3 py-1 bg-black text-white rounded-md"
        >
          Create Live Session
        </button>
      </form>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-xl font-medium underline my-5">Live Sessions</h2>
        <ul>
          {sessions.map((s) => (
            <div className="flex justify-center text-start p-3 bg-gray-200 rounded-md">
              <li key={s._id}>
                <h3>{s.streamID}</h3>
                <p>Course: {s.playbackId}</p>
                <p>Date: {new Date(s.date).toLocaleString()}</p>
                <a href={s.muxStreamId} target="_blank" rel="noreferrer">
                  Join
                </a>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
