'use client'

import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase.js";
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
import NewTask from "./components/NewTask";
import TasksList from "./components/TasksList";
import Register from "./components/Register";
import Login from "./components/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from 'next/image';

const Q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));

export default function Home() {

  const [newTask, setNewTask] = useState({});
  const [reg, setReg] = useState(false);
  const [log, setLog] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({ ...prev, id: Date.now(), [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTask.title) return;
    addDoc(collection(db, 'todos'), {
      user: user.uid,
      title: newTask.title,
      description: newTask.description,
      timestamp: serverTimestamp()
    });
    setAllTasks((prev) => [newTask, ...prev]);
    setNewTask({});
  };

  const handleDelete = (taskIdToRemove) => {
    setAllTasks((prev) => prev.filter(
      (task) => task.id !== taskIdToRemove,
    ));
  };

  const handleLogout = () => {            
    signOut(auth).then(() => {
      alert("Logged out successfully!");
    }).catch((error) => {
      console.error(error);
    });
  };

  const toggleReg = () => {
    setReg(!reg);
  };

  const toggleLog = () => {
    setLog(!log);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(Q, (snapshot) => {
          setAllTasks(snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data()['title'],
            description: doc.data()['description'],
            timestamp: doc.data()['timestamp']
          })));
        });
        const uid = user.uid;
        console.log("uid", uid);
      } else {
        console.log("User is logged out");
      }
    });
  }, [allTasks]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <nav className="bg-black p-4 w-full">
        <div className="container mx-auto flex justify-normal items-center">
          <button onClick={toggleReg} className="text-pink-100">Register</button>
          {reg ? <Register toggle={toggleReg} /> : null}
          <button onClick={toggleLog} className="text-purple-100 ml-24">Login</button>
          {log ? <Login toggle={toggleLog} /> : null}
          <div className="ml-auto">
            <button onClick={handleLogout} className="text-sky-100">Logout</button>
          </div>
        </div>
      </nav>
      <h1 className="text-3xl my-6 py-5">TASKS</h1>
      <div className="max-w-2xl lg:w-1/2 md:w-2/3 max-sm:w-64 items-center text-sm">
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
