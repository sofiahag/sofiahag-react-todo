"use client"

import React, { useState, useEffect } from "react";

import { db, auth } from "./firebase.js";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, orderBy, serverTimestamp, addDoc, where, getDocs, doc, deleteDoc } from "firebase/firestore";

import NewTask from "./components/NewTask";
import TasksList from "./components/TasksList";
import Register from "./components/Register";
import Login from "./components/Login";

import Image from "next/image";

const Q = query(collection(db, "todos"), orderBy("timestamp", "desc"));


export default function Home() {

  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState({});
  const [reg, setReg] = useState(false);
  const [log, setLog] = useState(false);
  const [allTasks, setAllTasks] = useState([]);


  const fetchTasks = async (user) => {
    if (user) {
      const uid = user.uid;
      const tasksQuery = query(collection(db, "todos"), where("user", "==", uid));
      const querySnapshot = await getDocs(tasksQuery);
      const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllTasks(tasks);
    }
  };  

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({ ...prev, id: Date.now(), [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newTask.title || !user) return;
    const uid = user.uid;
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        user: uid,
        title: newTask.title,
        description: newTask.description,
        timestamp: serverTimestamp()
      });
      const newTaskData = { id: docRef.id, ...newTask };
      setAllTasks((prev) => [newTaskData, ...prev]);
      setNewTask({});
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDelete = async (taskIdToRemove) => {
    console.log("Deleting task with ID:", taskIdToRemove);
    try {
      await deleteDoc(doc(db, "todos", String(taskIdToRemove)));
      setAllTasks((prev) => {
        const updatedTasks = prev.filter((task) => task.id !== taskIdToRemove);
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };  

  const provider = new GoogleAuthProvider();
  const handleGogLogin = async (event) => {
    event.preventDefault();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          await addDoc(collection(db, "users"), {
              uid: user.uid,
              name: 'Name Will Appear',
              authProvider: "google",
              email: user.email,
          });
      }
        //console.log("Google sign-in successful", user);
    } catch (error) {
        console.error("Google sign-in error", error);
    }
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
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchTasks(authUser);
        const uid = authUser.uid;
        //console.log("uid", uid);
      } else {
        setUser(null);
        //console.log("User is logged out");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <nav className="bg-black p-4 w-full">
        <div className="container mx-auto flex justify-normal items-center">
          <button onClick={toggleReg} className="text-pink-100">Register</button>
          {reg ? <Register newTask={newTask} setAllTasks={setAllTasks} toggle={toggleReg} /> : null}
          <button onClick={toggleLog} className="text-purple-100 ml-24 max-sm:ml-3">Login</button>
          {log ? <Login toggle={toggleLog} /> : null}
          <button onClick={handleGogLogin} className="text-purple-100 ml-24 max-sm:ml-3">Login with Google</button>
          <div className="ml-auto">
            <button onClick={handleLogout} className="text-sky-100">Logout</button>
          </div>
        </div>
      </nav>
      <h1 className="text-3xl my-6 py-5">TASKS</h1>
      <div className="max-w-2xl lg:w-1/2 md:w-2/3 max-sm:w-64 items-center text-sm">
        <NewTask
          user={user}
          newTask={newTask}
          handleChange={handleChange}
          handleSubmit={(event) => handleSubmit(event)}
        />
        {user && allTasks.length > 0 && <TasksList allTasks={allTasks} handleDelete={handleDelete} />}
      </div>
    </main>
  );
}
