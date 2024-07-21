'use client'

import React, { useState, useEffect, useRef } from 'react'

type EditableFieldProps = {
  value: string | string[]
  onSave: (value: string | string[]) => void
  type: 'text' | 'select' | 'multi-select'
  options?: string[]
}

export const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, type, options = [] }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  if (!isEditing) {
    return (
      <div onClick={() => setIsEditing(true)} className="cursor-pointer">
        {Array.isArray(value) ? value.join(', ') : value}
      </div>
    )
  }

  switch (type) {
    case 'select':
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue as string}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="border rounded p-1"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case 'multi-select':
      return (
        <div>
          {options.map((option) => (
            <label key={option} className="block">
              <input
                type="checkbox"
                checked={(editValue as string[]).includes(option)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...(editValue as string[]), option]
                    : (editValue as string[]).filter((v) => v !== option)
                  setEditValue(newValue)
                }}
              />
              {option}
            </label>
          ))}
          <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 rounded mt-2">
            Save
          </button>
        </div>
      )
    default:
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={editValue as string}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="border rounded p-1"
        />
      )
  }
}