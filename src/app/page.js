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
import Icon from "./assets/notepad.png";
import { ColorRing } from "react-loader-spinner";

const Q = query(collection(db, "todos"), orderBy("timestamp", "desc"));

export default function Home() {

  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState({});
  const [reg, setReg] = useState(false);
  const [log, setLog] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [localTasks, setLocalTasks] = useState([]);
  const [localCategories, setLocalCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchTasks = async (user, category) => {
    if (user) {
      const uid = user.uid;
      let tasksQuery = query(collection(db, "todos"), where("user", "==", uid));
      if (category) {
        tasksQuery = query(collection(db, "todos"), where("user", "==", uid), where("category", "==", category));
      }
      const querySnapshot = await getDocs(tasksQuery);
      const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllTasks(tasks);
    }
  };  
  const fetchCategories = async (user) => {
    if (user) {
      const uid = user.uid;
      const tasksQuery = query(collection(db, "todos"), where("user", "==", uid));
      const querySnapshot = await getDocs(tasksQuery);
      const categoriesSet = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categoriesSet.add(data.category);
        }
      });
      setCategories(Array.from(categoriesSet));
    } else {
      if (localCategories.length > 0) {
        setCategories(localCategories);
      }
    }
  };  

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user){
      const uid = user.uid;
      try {
        const docRef = await addDoc(collection(db, 'todos'), {
          user: uid,
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          timestamp: serverTimestamp()
        });
        const newTaskData = { id: docRef.id, ...newTask };
        setAllTasks((prev) => [newTaskData, ...prev]);
        setNewTask({});
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }else{
      try {
        const tempId = Date.now().toString();
        const newTaskData = { id: tempId, ...newTask };
        setAllTasks((prev) => [newTaskData, ...prev]);
        if (newTask.category && !localCategories.includes(newTask.category)) {
          setLocalCategories((prev) => [...prev, newTask.category]);
        }
        setNewTask({});
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleDelete = async (taskIdToRemove) => {
    console.log("Deleting task with ID:", taskIdToRemove);
    if (user) {
      try {
        await deleteDoc(doc(db, "todos", String(taskIdToRemove)));
        setAllTasks((prev) => {
          const updatedTasks = prev.filter((task) => task.id !== taskIdToRemove);
          return updatedTasks;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else {
      setAllTasks((prev) => {
        const updatedTasks = prev.filter((task) => task.id !== taskIdToRemove);
        return updatedTasks;
      });
      try {
        const tempId = Date.now().toString();
        const newTaskData = { id: tempId, ...newTask };
        setAllTasks((prev) => [newTaskData, ...prev]);
        if (newTask.category && !localCategories.includes(newTask.category)) {
          setLocalCategories((prev) => [...prev, newTask.category]);
        }
        const deletedTask = allTasks.find((task) => task.id === taskIdToRemove);
        if (deletedTask && deletedTask.category && localCategories.includes(deletedTask.category)) {
          setLocalCategories((prev) => prev.filter((category) => category !== deletedTask.category));
        }
        setNewTask({});
      } catch (error) {
        console.error("Error adding task:", error);
      }
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
              name: "Name Will Appear",
              authProvider: "google",
              email: user.email,
          });
      }
    } catch (error) {
        console.error("Google sign-in error", error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setAllTasks([]);
      setLocalTasks([]);
      setSelectedCategory("");
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
        fetchCategories(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { 
    setIsLoaded(isLoaded => true) 
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <nav className="bg-light-brown p-4 w-full mb-5">
        <div className="container mx-auto flex justify-normal items-center text-black">
          <Image src={Icon} width={30} height={30} alt="Notepad icon by Freepik- Flaticon"></Image>
          <button onClick={toggleReg} className="ml-10 max-sm:ml-2 max-sm:text-xs">REGISTER</button>
          <Image src={Icon} width={30} height={30} alt="Notepad icon by Freepik- Flaticon" className="ml-10 max-sm:ml-2"></Image>
          {reg ? <Register newTask={newTask} setAllTasks={setAllTasks} toggle={toggleReg} /> : null}
          <button onClick={toggleLog} className=" ml-10 max-sm:ml-2 max-sm:text-xs">LOGIN</button>
          <Image src={Icon} width={30} height={30} alt="Notepad icon by Freepik- Flaticon" className="ml-10 max-sm:ml-2"></Image>
          {log ? <Login toggle={toggleLog} /> : null}
          <button onClick={handleGogLogin} className="ml-10 max-sm:ml-2 max-sm:text-xs">Login with Google</button>
          <div className="ml-auto">
            <button onClick={handleLogout} className="max-sm:text-xs">LOGOUT</button>
          </div>
        </div>
      </nav>
      <div className="md:w-5/6 max-sm:w-64 items-center text-sm mt-3">
        <NewTask
          user={user}
          newTask={newTask}
          handleChange={handleChange}
          handleSubmit={(event) => handleSubmit(event)}
        />
        <select
          className="border-gray-300 border-2 text-base mb-4 p-1"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            fetchTasks(user, e.target.value);
          }}
        >
        <option value="">All categories</option>
        {user
          ? categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))
        : localCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        </select>
        <div className="mb-5">
          {isLoaded ? <TasksList allTasks={allTasks} handleDelete={handleDelete} /> : 
            <ColorRing 
              colors={["#FFEF8A", "#BBF7D0", "#BFDBFE", "#DDD6FE", "#FBCFE8"]} 
              height={"80"} 
              width={"80"}
              ariaLabel="color-ring-loading"
              wrapperClass="color-ring-wrapper"
            />}
        </div>
      </div>
    </main>
  );
}
