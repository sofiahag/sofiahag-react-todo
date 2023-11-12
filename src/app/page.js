'use client'

import Image from 'next/image'
import React, { useState, useEffect } from "react";
import { db, getAuth } from "./firebase.js";
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Reset from "./components/Reset.jsx";
import Dashboard from "./components/Dashboard.jsx";
import NewTask from "./components/NewTask";
import TasksList from "./components/TasksList";
import Link from 'next/link';


const Q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));

export default function Home() {

  const [newTask, setNewTask] = useState({});
  const [childData, setChildData] = useState("");


  let user = getAuth().currentUser;

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({ ...prev, id: Date.now(), [name]: value }));
  };

  const [allTasks, setAllTasks] = useState([]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTask.title) return;
    addDoc(collection(db, 'todos'), {
      user: user.uid,
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
      if (user) {
        setAllTasks(snapshot.docs.map(doc => ({
          user: user.uid,
          id: doc.id,
          title: doc.data()['title'],
          description: doc.data()['description'],
          timestamp: doc.data()['timestamp']
        })))
      }
    })
  },[allTasks, user]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {user ? <Dashboard /> : <Login />}
      <h1 className="text-3xl py-5">TASKS</h1>
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
