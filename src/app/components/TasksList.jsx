import React from "react";

import { db } from "../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

export default function TasksList({ allTasks, handleDelete }) {
  console.log(allTasks)
  const handleTaskDelete = async (id) => {
    handleDelete(id);
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <ul>
      {allTasks.map(({ id, title, description }) => (
        <li className="bg-yellow-100 border-2 border-gray-300 text-base mb-4" key={id}>
          <div className="bg-yellow-200">
            <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
            <button className="bg-yellow-50" onClick={() => handleTaskDelete(id)}>X</button>
          </div>
          {!description ? null : <p className="text-base break-all">{description}</p>}
        </li>
      ))}
    </ul>
  );
}
