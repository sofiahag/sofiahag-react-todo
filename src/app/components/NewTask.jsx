import React from "react";

export default function NewTask({ newTask, handleChange, handleSubmit }) {
  return (
    <div className="py-5 font-kalam">
    <form onSubmit={handleSubmit}>
      <input
        className="border-gray-300 border-2 text-base"
        name="title"
        placeholder="New task"
        value={newTask.title || ""}
        onChange={handleChange}
      />
      {!newTask.title ? null : (
        <>
          <textarea
            name="description"
            placeholder="Details..."
            value={newTask.description || ""}
            onChange={handleChange}
            className="text-base"
          />
          <button className="bg-pink-200 w3" type="submit">Add Task</button>
        </>
      )}
    </form>
    </div>
  );
}