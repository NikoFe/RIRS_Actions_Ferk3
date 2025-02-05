import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = ({ post, user, fetchPosts }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/posts/${post.name}`
      );
      fetchPosts();

      const responseString = JSON.stringify(response.status);
      console.log("Response DELETE Data:", responseString);

      if (
        responseString == "201" ||
        responseString == "200" ||
        responseString == "202"
      ) {
        console.log("Got here!");
        toast.success("Post successfuly deleted!");
      } else {
        toast.error("Error in deleting post!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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

  const handleUpdate = async () => {
    const newParts = prompt("Enter new parts (comma-separated):", post.parts);

    let sum = 0.0;

    const prices = extractPrices(newParts);

    for (let i = 0; i < prices.length; i++) {
      console.log("PARTS for sum: ", prices[i]);

      sum += parseFloat(prices[i]);
    }
    console.log("NEW PRICE: ", sum);

    if (newParts) {
      try {
        const response = await axios.put(
          `http://localhost:5000/posts/${post.name}`,
          {
            parts: newParts,
            price: sum,
          }
        );

        const responseString = JSON.stringify(response.status);
        console.log("Response Data:", responseString);

        if (
          responseString == "201" ||
          responseString == "200" ||
          responseString == "202"
        ) {
          toast.success("Post successfuly updated!");
        } else {
          toast.error("Error in updating post!");
        }

        fetchPosts();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  let splitText = post.parts.split(",");

  return (
    <div>
      <ToastContainer position="bottom-right" />
      <h3>{post.name}</h3>
      {/*<p>Parts: {post.parts.replace(",", "\n")}</p>*/}

      {splitText.map((row) => {
        return (
          <div>
            <p>{row}</p>
          </div>
        );
      })}

      <div>
        <p>Total price: {post.price}</p>
      </div>

      {user && user.username === post.user_username && (
        <>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Post;
