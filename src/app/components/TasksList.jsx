import React from "react";
import { db } from "../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

const generateFallbackKey = () => {
  return Date.now().toString();
};

export default function TasksList({ allTasks, handleDelete }) {
  if (allTasks.length === 0) {
    return <p>No tasks yet</p>;
  }

  return (
    <ul>
      {allTasks.map(({ id, title, description }) => {
        const key = id || generateFallbackKey();
        if (!id) {
          console.warn('Task skipped due to missing id:', { title, description });
          return null;
        }

        return (
          <li className="bg-yellow-100 border-2 border-gray-300 text-base mb-4" key={key}>
            <div className="bg-yellow-200">
              <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
              <button className="bg-yellow-50" onClick={() => handleDelete(id, allTasks)}>X</button>
            </div>
            {!description ? null : <p className="text-base break-all">{description}</p>}
          </li>
        );

      })}
    </ul>
  );
}
