// pages/statistics.tsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTaskStatistics } from '@/hooks/useTaskStatistics' // You'll need to create this custom hook

export default function Statistics() {
  const { tasksByStatus, tasksByPriority } = useTaskStatistics()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Task Statistics</h1>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tasksByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tasksByPriority}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}