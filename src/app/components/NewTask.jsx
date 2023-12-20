import React from "react";

export default function NewTask({ user, newTask, handleChange, handleSubmit }) {

  const handleFormSubmit = (event) => {
    //console.log('Event object:', event);
    event.preventDefault();
    if (!user) {
      alert("Please log in to add a task");
      return;
    }
    handleSubmit(event);
  };

  return (
    <div className="py-5 font-kalam">
    <form onSubmit={handleFormSubmit}>
      <input
        className="border-gray-300 border-2 text-base mb-1"
        name="category"
        placeholder="Enter category"
        value={newTask.category || ""}
        onChange={handleChange}
      />
      <input
        className="border-gray-300 border-2 text-base"
        name="title"
        placeholder="Enter task"
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
          <button className="bg-pink-200 w3 absolute" type="submit">
            Add Task
          </button>
        </>
      )}
    </form>
    </div>
  );
}