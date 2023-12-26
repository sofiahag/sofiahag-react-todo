import React from "react";

export default function NewTask({ user, newTask, handleChange, handleSubmit }) {

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      alert("Please log in to save a task");
    }
    handleSubmit(event);
  };

  return (
    <div className="py-5 font-kalam flex justify-center items-center w-full">
    <form onSubmit={handleFormSubmit} className="w-2/5">
      <label for="category" className="text-white">Add a category of task:</label>
      <input
        className="text-base mb-1"
        name="category"
        placeholder="Enter category"
        value={newTask.category || ""}
        onChange={handleChange}
        id="category"
      />
      <label for="task" className="text-white">Add task:</label>
      <input
        className="text-base"
        name="title"
        placeholder="Enter task"
        value={newTask.title || ""}
        onChange={handleChange}
        id="task"
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
          <button className="bg-pink-200 w3 absolute" type="submit">
            Add Task
          </button>
        </>
      )}
    </form>
    </div>
  );
}