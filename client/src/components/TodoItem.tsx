import React, { useState } from 'react';

interface Props {
  id: number;
  task: string;
  isCompleted: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ id, task, isCompleted, onToggle, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task);

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={isCompleted} onChange={() => onToggle(id)} />
        {!editing ? (
          <span className={isCompleted ? 'line-through text-gray-400' : ''}>{task}</span>
        ) : (
          <input value={value} onChange={(e) => setValue(e.target.value)} className="border p-1 rounded" />
        )}
      </div>
      <div className="flex gap-2">
        {!editing ? (
          <button className="text-sm text-blue-500" onClick={() => setEditing(true)}>Edit</button>
        ) : (
          <button className="text-sm text-green-500" onClick={() => setEditing(false)}>Save</button>
        )}
        <button className="text-sm text-red-500" onClick={() => onDelete(id)}>Delete</button>
      </div>
    </li>
  );
}