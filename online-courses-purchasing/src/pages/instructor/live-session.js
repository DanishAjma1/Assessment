import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function LiveSessionForm() {
  const [sessions, setSessions] = useState([]);
  const location  = useLocation();
  const {course} = location.state;
  const url = "http://localhost:5000";
  useEffect(() => {
    axios.get(url+"/instructor/get-live-sessions").then((res) => setSessions(res.data));
  }, []);

  const [session, setSession] = useState({
    course: "",
    muxStreamId: "",
    playbackId: "",
    isActive: false,
    date: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSession({
      ...session,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/instructor/insert-live-session", session, {
        withCredentials: true,
      });
      alert("Live Session created successfully!");
      setSession({
        course: "",
        muxStreamId: "",
        playbackId: "",
        isActive: false,
        date: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating live session");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col  justify-center items-center gap-3 p-5">
        <h2 className="text-2xl font-bold">Create Live Session</h2>

        <input
          type="text"
          name="course"
          placeholder="Course ID"
          value={course._id}
          disabled
        />

        <input
          type="text"
          name="muxStreamId"
          placeholder="Mux Stream ID"
          value={session.muxStreamId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="playbackId"
          placeholder="Playback ID"
          value={session.playbackId}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={session.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <input
          type="date"
          name="date"
          value={session.date}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Live Session</button>
      </form>
      <div>
        <h2>Live Sessions</h2>
        <ul>
          {sessions.map((s) => (
            <li key={s._id}>
              <h3>{s.title}</h3>
              <p>Course: {s.course?.title}</p>
              <p>Date: {new Date(s.date).toLocaleString()}</p>
              <a href={s.link} target="_blank" rel="noreferrer">
                Join
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
