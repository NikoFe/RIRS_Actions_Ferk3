import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import Creation from "./Creation";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userAverage, setUserAverage] = useState(0.0);
  //const [postName, setPostName] = useState([]);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [newPost, setNewPost] = useState({ name: "", parts: "" });
  const [price, setPrice] = useState(0.0);
  const [tempFilter, setTempFilter] = useState(0.0);
  const [filter, setFilter] = useState(0.0);
  const [tempUFilter, setTempUFilter] = useState("");
  const [UFilter, setUFilter] = useState("");
  const [averageError, setAverageError] = useState(false);

  //const [parts, setParts] = useState({ name: "", price: "" });
  const [rows, setRows] = useState([
    { part: "", price: 0, key: uuidv4() },
    { part: "", price: 0, key: uuidv4() },
    { part: "", price: 0, key: uuidv4() },
  ]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
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
    for (let i = 0; i < rows.length; i++) {
      console.log("i: ", i);
      console.log("PART: ", rows[i].part);
      console.log("PRICE: ", rows[i].price);
    }

    const isValid = rows.every((row) => row.part && row.price);
    if (!isValid) {
      alert("Please fill out all fields before submitting.");
      return;
    }
    //console.log("D part: " + rows[0].part);

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

    // const string_values = values.join();
    console.log("user_username: ", user.username);
    console.log("concatenated: ", concatenated);
    console.log("price: ", price);

    try {
      const response = await axios.post("http://localhost:5000/posts", {
        ...newPost,
        user_username: user.username,
        parts: concatenated,
        price: price,
      });
      fetchPosts();

      setRows([
        { part: "", price: 0, key: uuidv4() },
        { part: "", price: 0, key: uuidv4() },
        { part: "", price: 0, key: uuidv4() },
      ]);

      const responseString = JSON.stringify(response.status);
      console.log("Response Data:", responseString);

      if (responseString == "201") {
        toast.success("New post successfuly created!");
      } else {
        toast.error("Error in creating post!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLogout = () => setUser(null);

  const handleChange = (index, field, value) => {
    console.log("////////////\n");
    console.log("field: " + field);

    setRows((prevRows) => {
      const updatedRows = prevRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );

      // Calculate sum based on updatedRows
      const newTotal = updatedRows.reduce(
        (acc, row) => acc + (parseFloat(row.price) || 0),
        0
      );

      setPrice(newTotal);

      return updatedRows;
    });
  };

  const extractPrices = (str) => {
    const regex = /Price:\s(\d+)/g;
    let prices = [];
    let match;

    while ((match = regex.exec(str)) !== null) {
      prices.push(match[1]);
    }

    return prices;
  };

  const getAverage = async () => {
    let calculated = 0.0;

    posts.forEach((post) => {
      if (post.user_username === selectedUser) {
        let sum = 0.0;

        const newParts = post.parts;
        const stringParts = newParts.toString();
        const prices = extractPrices(stringParts);

        prices.forEach((price) => {
          sum += parseFloat(price);
        });

        calculated += sum;
      }
    });
    if (calculated == 0.0 && selectedUser != "") {
      setAverageError("Error user not found");
    }
    return calculated;
  };

  const fetchAverage = async () => {
    let calculatedAverage = await getAverage(); // Await the promise
    setUserAverage(calculatedAverage); // Set state with resolved value
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    fetchAverage(); // Call the async function
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) fetchAverage(); // Call the async function
  }, [selectedUser]);

  return (
    <div>
      <ToastContainer position="bottom-right" />
      {user ? (
        <>
          <h1 data-testid="welcome_header">Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Logout</button>

          <div className="average-div">
            <p>Average computer price for user:</p>
            <input
              className="selectedUser"
              data-testid="selectedUser"
              type="text"
              placeholder=""
              onChange={(e) => handleChange(setSelectedUser(e.target.value))}
            />
            <p data-testid="user-average">: {parseFloat(userAverage)}</p>

            {averageError && (
              <p className="average-not-found" data-testid="average-not-found">
                {averageError}
              </p>
            )}
          </div>

          <div>
            <input
              className="filtered"
              data-testid="filtered_input"
              min="0"
              max="1000"
              type="number"
              placeholder="Filtered_Price"
              step="any"
              onChange={(e) => handleChange(setTempFilter(e.target.value))}
            />
            <button
              data-testid="filter-button"
              onClick={() => {
                setFilter(tempFilter);
              }}
            >
              Filter
            </button>
            <input
              className="filteredUser"
              data-testid="filtered_user_input"
              type="text"
              placeholder="Filtered_User"
              onChange={(e) => handleChange(setTempUFilter(e.target.value))}
            />
            <button
              data-testid="filter-user-button"
              onClick={() => {
                setUFilter(tempUFilter);
              }}
            >
              Filter
            </button>
          </div>
          <Creation
            newPost={newPost}
            setNewPost={setNewPost}
            rows={rows}
            handleChange={handleChange}
            handleCreatePost={handleCreatePost}
            setPice={setPrice}
            price={price}
          />

          <h2>Posts:</h2>

          {posts.map(
            (post) =>
              Number(post.price) > Number(filter) &&
              (post.user_username == UFilter || UFilter == "") && (
                <Post
                  key={post.name + user}
                  post={post}
                  user={user}
                  fetchPosts={fetchPosts}
                />
              )
          )}
        </>
      ) : (
        <Login
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleLogin={handleLogin}
        ></Login>
      )}
    </div>
  );
};

export default App;
