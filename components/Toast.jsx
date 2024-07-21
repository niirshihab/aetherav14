'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white flex items-center`}>
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)} className="ml-4">
        <X size={18} />
      </button>
    </div>
  )
}