import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Material() {
  const location = useLocation();
  const { course } = location.state;
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
        setMaterials(material);
        console.log(material);
      } catch (error) {
        console.error(error);
      }
    };
    getMaterial();
  }, []);
  const handleSubmit = async () => {
    const formData = new FormData();

    if (!file && (!selectedFiles || selectedFiles.length === 0)) {
      console.log("No file selected");
      return;
    }
    if (file) {
      try {
        const { data } = await axios.post(
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
  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col justify-center items-center">
        <input
        className="p-3"
          type="file"
          accept=".pdf,.ppt,.pptx,video/*"
          onChange={handleChange}
          multiple
        />
        <button type="submit" className="bg-black text-white px-3 py-1 w-fit rounded-md">Upload</button>
      </form>
      <div>
        <ul className="flex flex-col justify-center mt-5 items-center">
          {materials.map((mat, index) => (
            <div className="flex flex-col px-6 py-4 text-start bg-gray-300 rounded-md">
              <li>{mat.course}</li>
              <li>{mat.filename}</li>
              <li>{mat.contentType}</li>
              <li>{mat.s3Key}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
