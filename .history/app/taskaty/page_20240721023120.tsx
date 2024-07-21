'use client'

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/Button';

export type { Button };
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', brand: '', priority: '', due_date: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ status: '', priority: '', brand: '' });
  const [sortBy, setSortBy] = useState('due_date');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filter, sortBy]);

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

  const applyFiltersAndSort = () => {
    let filtered = tasks.filter(task => 
      (filter.status === '' || task.status === filter.status) &&
      (filter.priority === '' || task.priority === filter.priority) &&
      (filter.brand === '' || task.brand === filter.brand)
    );

    filtered.sort((a, b) => {
      if (a[sortBy as keyof Task] < b[sortBy as keyof Task]) return -1;
      if (a[sortBy as keyof Task] > b[sortBy as keyof Task]) return 1;
      return 0;
    });

    setFilteredTasks(filtered);
  };

  const handleTaskAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      const { error } = await supabase
        .from('tasks')
        .update({ ...newTask })
        .eq('id', editingTask.id);

      if (error) {
        console.error('Error updating task:', error);
      } else {
        setEditingTask(null);
      }
    } else {
      const { error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, status: 'todo' }]);

      if (error) {
        console.error('Error adding task:', error);
      }
    }
    setNewTask({ title: '', description: '', brand: '', priority: '', due_date: '' });
    setIsModalOpen(false);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      fetchTasks();
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setNewTask({ ...task });
    } else {
      setEditingTask(null);
      setNewTask({ title: '', description: '', brand: '', priority: '', due_date: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
        <Button onClick={() => openModal()} className="flex items-center" type="button" as="button">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={() => openModal()} className="flex items-center" type="button">
          <PlusCircle className="mr-2" />
          Add Task
        </Button>
        <div className="flex space-x-2">
          <select 
            value={filter.status} 
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border p-2"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select 
            value={filter.priority} 
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="border p-2"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2"
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => openModal(task)} className="text-blue-500 hover:text-blue-700">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex space-x-4 text-sm">
              <span className={`px-2 py-1 rounded ${
                task.priority === 'high' ? 'bg-red-200 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                {task.priority}
              </span>
              <span className="text-gray-500">Brand: {task.brand}</span>
              <span className="text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded ${
                task.status === 'todo' ? 'bg-gray-200 text-gray-800' :
                task.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                'bg-green-200 text-green-800'
              }`}>
                {task.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleTaskAction} className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border p-2"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border p-2"
              />
              <input
                type="text"
                placeholder="Brand"
                value={newTask.brand}
                onChange={(e) => setNewTask({ ...newTask, brand: e.target.value })}
                className="w-full border p-2"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full border p-2"
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
                className="w-full border p-2"
                <Button type="button" onClick={() => setIsModalOpen(false)} as="button">{'Cancel'}</Button>
                <Button type="submit" as="button">{editingTask ? 'Update' : 'Add'}{' Task'}</Button>
                <Button type="button" onClick={() => setIsModalOpen(false)}>{'Cancel'}</Button>
                <Button type="submit">{editingTask ? 'Update' : 'Add'}{' Task'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};