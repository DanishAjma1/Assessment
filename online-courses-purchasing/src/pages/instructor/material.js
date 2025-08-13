import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Material() {
  let course = JSON.parse(localStorage.getItem('course'));

  const [pdfSrc, setPdfSrc] = useState();
  const [unsopportedSrc, setUnsopportedSrc] = useState();
  const [powerSrc, setPowerSrc] = useState();
  const [videoSrc, setVideoSrc] = useState();

  const [s3key, setS3key] = useState();
  const [file, setFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [material, setMaterial] = useState([]);
  const url = "http://localhost:5000";
  useEffect(() => {
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
        console.log(material);
      } catch (error) {
        console.error(error);
      }
    };
    getMaterial();
    getMaterialFromS3();
  }, []);
  const handleSubmit = async () => {
    const formData = new FormData();

    if (!file && (!selectedFiles || selectedFiles.length === 0)) {
      console.log("No file selected");
      return;
    }
    if (file) {
      try {
        const { data } = await axios.get(
          url + "/presign-upload-url",
          { filename: file.filename, contentType: file.type },
          {
            "Content-Type": "multipart/form-data",
          }
        );

        const { uploadUrl, key } = data;
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        const material = {
          course: course._id,
          filename: file.name,
          contentType: file.type,
          s3Key: key,
        };
        await axios
          .post(url + "/instructor/insert-material", material, {
            withCredentials: true,
          })
          .then(() => {
            alert("Material uploaded successfully");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err.message);
      }
    } else if (selectedFiles && selectedFiles.length > 0) {
      selectedFiles.forEach((f) => {
        formData.append("files", f);
      });
    }
  };
  const handleChange = (e) => {
    if (e.target.files.length === 1) {
      setFile(e.target.files[0]);
    } else {
      setSelectedFiles([e.target.files]);
    }
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
    <div className="flex flex-row justify-evenly">
      <div className="flex flex-col">
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
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col justify-center items-center"
      >
        <input
          className="p-3"
          type="file"
          accept=".pdf,.ppt,.pptx,video/*"
          onChange={handleChange}
          multiple
        />
        <button
          type="submit"
          className="bg-black text-white px-3 py-1 w-fit rounded-md"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
