import React from "react";
import axios from "axios";

const Post = ({ post, user, fetchPosts }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${post.name}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = async () => {
    const newParts = prompt("Enter new parts (comma-separated):", post.parts);
    if (newParts) {
      try {
        await axios.put(`http://localhost:5000/posts/${post.name}`, {
          parts: newParts,
        });
        fetchPosts();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  let splitText = post.parts.split(",");

  return (
    <div>
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
