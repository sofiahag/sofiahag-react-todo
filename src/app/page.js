'use client'

import Image from 'next/image'
import React, { useState } from "react";
import NewTask from "./components/NewTask";
import TasksList from "./components/TasksList";

//Todo: add Postgres db

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
    setAllTasks((prev) => [newTask, ...prev]);
    setNewTask({});
  };
  const handleDelete = (taskIdToRemove) => {
    setAllTasks((prev) => prev.filter(
      (task) => task.id !== taskIdToRemove
    ));
  };

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
