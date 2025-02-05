import React from "react";

export default function Creation({
  newPost,
  setNewPost,
  rows,
  handleChange,
  handleCreatePost,
  setPice,
  price,
}) {
  return (
    <div>
      <h2>Create Post</h2>
      <input
        placeholder="Post Name"
        value={newPost.name}
        className="name_input"
        onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
      />

      <div className="create_rows">
        {rows.map((row, index) => (
          <div className="row" key={row}>
            <input
              type="text"
              placeholder="Computer Part"
              value={row.part}
              onChange={(e) => handleChange(index, "part", e.target.value)}
            />
            <input
              min="0"
              max="1000"
              type="number"
              placeholder="Price"
              value={row.price}
              step="any"
              onChange={(e) => handleChange(index, "price", e.target.value)}
            />
          </div>
        ))}

        <div>
          <p> Total price: {price}</p>
        </div>
      </div>
      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
}
