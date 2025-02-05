import React from "react";

export default function Creation({
  newPost,
  setNewPost,
  rows,
  handleChange,
  handleCreatePost,
}) {
  return (
    <div>
      <h2>Create Post</h2>
      <input
        placeholder="Post Name"
        value={newPost.name}
        onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
      />

      <div className="create_rows">
        {rows.map((row, index) => (
          <div className="row" key={row.key}>
            <input
              type="text"
              placeholder="Computer Part"
              value={row.part}
              onChange={(e) => handleChange(index, "part", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={row.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
}
