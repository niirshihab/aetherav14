'use client'

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/Button';
import { PlusCircle, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Taskaty</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <Button onClick={() => openModal()} className="flex items-center bg-green-500 hover:bg-green-600 transition-colors duration-300">
          <PlusCircle className="mr-2" />
          Add Task
        </Button>
        <div className="flex flex-wrap gap-2">
          <select 
            value={filter.status} 
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select 
            value={filter.priority} 
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <TaskCard task={task} onEdit={openModal} onDelete={deleteTask} />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleTaskAction} className="space-y-4">
              {/* ... (form fields remain the same) */}
              <div className="flex justify-end space-x-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-400">Cancel</Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">{editingTask ? 'Update' : 'Add'} Task</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; onDelete: (id: string) => void }> = ({ task, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-blue-500 hover:text-blue-700 transition-colors duration-300">
            <Edit2 size={20} />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700 transition-colors duration-300">
            <Trash2 size={20} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-sm ${
                task.priority === 'high' ? 'bg-red-200 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                {task.priority}
              </span>
              <span className="text-gray-500 text-sm">Brand: {task.brand}</span>
              <span className="text-gray-500 text-sm">Due: {new Date(task.due_date).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                task.status === 'todo' ? 'bg-gray-200 text-gray-800' :
                task.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                'bg-green-200 text-green-800'
              }`}>
                {task.status}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-full max-w-md"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
