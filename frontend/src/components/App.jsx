import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [newPost, setNewPost] = useState({ name: "", parts: "" });
  //const [parts, setParts] = useState({ name: "", price: "" });
  const [rows, setRows] = useState([
    { part: "", price: "", key: uuidv4() },
    { part: "", price: "", key: uuidv4() },
    { part: "", price: "", key: uuidv4() },
  ]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        loginForm
      );
      setUser(response.data.user);
      fetchPosts();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCreatePost = async () => {
    const isValid = rows.every((row) => row.part && row.price);
    if (!isValid) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    console.log("D part: " + rows[0].part);
    console.log("E price : " + rows[0].price);

    const values = rows.map((row) => ({
      part: row.part,
      price: row.price,
      key: uuidv4(),
    }));

    let concatenated = "";

    for (let i = 0; i < values.length; i++) {
      concatenated +=
        "Part: " + values[i].part + " Price: " + values[i].price + ",";
    }

    const string_values = values.join();
    console.log("STRING VALUES: ", concatenated);

    try {
      await axios.post("http://localhost:5000/posts", {
        ...newPost,
        user_username: user.username,
        concatenated,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLogout = () => setUser(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>

      {user ? (
        <>
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
          <h2>Create Post</h2>
          <input
            placeholder="Post Name"
            value={newPost.name}
            onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
          />

          {/*
          <input
            placeholder="Price"
            onChange={(e) => setNewPost({ ...newPost, parts: e.target.value })}
          />
           */}
          <div className="rows">
            {rows.map((row, index) => (
              <div className="row" key={row}>
                <input
                  type="text"
                  placeholder="Computer Part"
                  //value={part}
                  onChange={(e) => handleChange(index, "part", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  //value={price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </div>
            ))}
          </div>
          <button onClick={handleCreatePost}>Create Post</button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <input
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
          />
          <input
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}

      <h2>Posts:</h2>
      {posts.map((post) => (
        <Post key={post.name} post={post} user={user} fetchPosts={fetchPosts} />
      ))}
    </div>
  );
};

export default App;
