'use client'

import Image from 'next/image'
import React, { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot, serverTimestamp, doc, addDoc, deleteDoc } from "firebase/firestore";
import NewTask from "./components/NewTask";
import TasksList from "./components/TasksList";


const Q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));

export default function Home() {

  const [newTask, setNewTask] = useState({});

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({ ...prev, id: Date.now(), [name]: value }));
  };

  const [allTasks, setAllTasks] = useState([]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTask.title) return;
    addDoc(collection(db, 'todos'), {
      title: newTask.title,
      description: newTask.description,
      timestamp: serverTimestamp()
    })
    setAllTasks((prev) => [newTask, ...prev]);
    setNewTask({});
  };
  const handleDelete = (taskIdToRemove) => {
    setAllTasks((prev) => prev.filter(
      (task) => task.id !== taskIdToRemove,
    ));
  };

  useEffect(() => {
    onSnapshot(Q, (snapshot) => {
      setAllTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data()['title'],
          description: doc.data()['description'],
          timestamp: doc.data()['timestamp']
      })))
    })
  },[allTasks]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-3xl my-6 py-5">TASKS</h1>
      <div className="max-w-2xl lg:w:1/2 md:w-2/3 max-sm:w-64 items-center text-sm">
      <NewTask
        newTask={newTask}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <TasksList allTasks={allTasks} handleDelete={handleDelete} />
      </div>
    </main>
  );
}
