'use client'

import Image from 'next/image'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { db, getAuth } from "./firebase.js";
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Reset from "./components/Reset.jsx";
import Dashboard from "./components/Dashboard.jsx";
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
    let user = getAuth().currentUser;
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
      let user = getAuth().currentUser;
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
  },[allTasks]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
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
