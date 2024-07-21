'use client'

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/Button';
import { Widget } from '@/components/Widget';

type Task = {
  id: string;
  title: string;
  description: string;
  brand: string;
  priority: string;
  due_date: string;
  status: string;
};

export const Taskaty: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', brand: '', priority: '', due_date: '' });
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('tasks')
      .insert([{ ...newTask, status: 'todo' }]);
    
    if (error) {
      console.error('Error adding task:', error);
    } else {
      setNewTask({ title: '', description: '', brand: '', priority: '', due_date: '' });
      fetchTasks();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Taskaty</h1>
      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Brand"
          value={newTask.brand}
          onChange={(e) => setNewTask({ ...newTask, brand: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          className="border p-2 mr-2"
        />
        <Button type="submit">Add Task</Button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-2 border rounded">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Brand: {task.brand}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {task.due_date}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};