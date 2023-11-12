import React from "react";
import { db } from "../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";

export default function TasksList({ allTasks, handleDelete }) {
  return (
    <ul>
      {allTasks.map(({ id, user, title, description }) => (
        <li className="bg-yellow-100 border-2 border-gray-300 text-base mb-4" key={id}>
          <div className="bg-yellow-200">
            <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
            <button className="bg-yellow-50" onClick={() => {handleDelete(id); deleteDoc(doc(db, 'todos', id))}}>X</button>
          </div>
          {!description ? null : <p className="text-base break-all">{description}</p>}
        </li>
      ))}
    </ul>
  );
}
