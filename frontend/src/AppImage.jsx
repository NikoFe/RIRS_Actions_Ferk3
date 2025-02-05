import React, { useState, useEffect } from "react";

const App = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      setFile(null);
      fetchImages(); // Refresh images after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Fetch images from the server
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:5000/images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload</button>

      <h2>Stored Images</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${image.base64}`}
            alt="Stored"
            width="200"
          />
        ))}
      </div>
    </div>
  );
};

export default App;
