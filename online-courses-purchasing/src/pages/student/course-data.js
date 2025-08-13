import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CourseData() {
  const location = useLocation();
  const { course } = location.state;
  const [pdfSrc, setPdfSrc] = useState();
  const [unsopportedSrc, setUnsopportedSrc] = useState();
  const [powerSrc, setPowerSrc] = useState();
  const [videoSrc, setVideoSrc] = useState();
  const [sessions, setSessions] = useState([]);

  const [s3key, setS3key] = useState();
  const [material, setMaterial] = useState([]);
  const url = "http://localhost:5000";
  useEffect(() => {
    getMaterial();
    fetchSessions();
    getMaterialFromS3();
  }, []);
  const getMaterial = async () => {
    try {
      const response = await axios.get(
        `${url}/instructor/material/${course._id}`,
        {
          withCredentials: true,
        }
      );
      const { material } = response.data;
      setMaterial(material);
      setS3key(material[0].s3key);
    } catch (error) {
      console.error(error);
    }
  };
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
  const getMaterialFromS3 = async () => {
    try {
      setS3key(material.s3Key);
      const { data } = await axios.get(`${url}/presign-get-url/${s3key}`, {
        withCredentials: true,
      });

      const { getUrl } = data;
      const response = await axios.get(getUrl, { responseType: "blob" });
      const contentType = response.headers["content-type"];

      console.log("File type:", contentType);
      const blobUrl = URL.createObjectURL(response.data);

      if (contentType === "application/pdf") {
        setPdfSrc(blobUrl);
      } else if (contentType.startsWith("video/")) {
        setVideoSrc(blobUrl);
      } else if (contentType === "application/vnd.ms-powerpoint") {
        setPowerSrc(blobUrl);
      }else{
        setUnsopportedSrc(blobUrl);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-row gap-5 justify-evenly">
      <div className="">
        <h2 className="text-xl font-medium pt-5 underline">Course data</h2>
        <p className="text-sm">
          If the data will be pdf,video or ppt it will be opened in their
          supported elements
        </p>
        <ul className="flex flex-col text-start mt-5 items-center px-6 py-4 bg-gray-200 rounded-md">
          {material.map((mat, index) => {
            let content;
            <div
              key={index}
              className="flex flex-col px-6 py-4 text-start gap-5 bg-gray-300 rounded-md"
            >
              if (mat.contentType === "application/pdf"){" "}
              {
                (content = (
                  <iframe
                    className="bg-gray-600 rounded-md"
                    src={pdfSrc} // Your fetched presigned URL for PDF
                    width="100%"
                    height="300"
                    title={mat.filename}
                  />
                ))
              }{" "}
              else if (mat.contentType.startsWith("video/")){" "}
              {
                (content = (
                  <video
                    src={videoSrc} // Your fetched presigned URL for video
                    className="rounded-md bg-gray-700"
                    controls
                    width="100%"
                    height="300"
                  />
                ))
              }{" "}
              else if ( mat.contentType === "application/vnd.ms-powerpoint" ||
              mat.contentType ===
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              )
              {
                (content = (
                  <iframe
                    src={`${powerSrc}(
                      mat.fileUrl
                    )}&embedded=true`}
                    width="100%"
                    height="400"
                    title={mat.filename}
                  />
                ))
              }
              else if (mat.contentType.startsWith("video/")){" "}
              {
                (content = (
                  <video
                    src={videoSrc}
                    className="rounded-md bg-gray-700"
                    controls
                    width="100%"
                    height="100%"
                  />
                ))
              }{" "}
              else{" "}
              {
                <p className="text-red-600">
                  Unsupported file type: {unsopportedSrc}
                </p>
              }
            </div>;
            return (
              <div>
                {content}
                <li>FileName : {mat.filename}</li>
                <li>Content Type : {mat.contentType}</li>
                <li>S3key : {mat.s3Key}</li>
              </div>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-xl font-medium underline my-5">Live Sessions</h2>
        <ul>
          {sessions.map((s) => (
            <div className="flex justify-center text-start p-3 bg-gray-200 rounded-md">
              <li key={s._id} className="gap-1 flex flex-col">
                <h3>{s.streamID}</h3>
                <p>Course: {s.playbackId}</p>
                <p>Date: {new Date(s.date).toLocaleString()}</p>
                <a href={s.muxStreamId} target="_blank" rel="noreferrer" className="bg-black px-3 py-1 text-white rounded-md w-fit">
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
