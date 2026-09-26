import { useState, useEffect } from 'react'

export default function App() {
  const [text, setText] = useState('')
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks')
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : []
      return Array.isArray(parsedTasks)
        ? parsedTasks.filter((task) =>
            task !== null &&
            typeof task === 'object' &&
            typeof task.id === 'string' &&
            typeof task.title === 'string' &&
            typeof task.done === 'boolean'
          )
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('タスクの保存に失敗しました。', error)
    }
  }, [tasks])

  function addTask(event) {
    event.preventDefault()

    const title = text.trim()
    if (title === '') return

    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      done: false,
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
    setText('')
  }

  function toggleTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  function deleteTask(id) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    )
  }

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl font-bold">タスク管理アプリ</h1>
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="タスクを入力"
          aria-label="新しいタスク"
          className="border p-2"
        />
        <button type="submit" className="border px-4 py-2">
          追加
        </button>
      </form>
      <ul className="mt-4">
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              aria-pressed={task.done}
              className={task.done ? 'text-gray-500 line-through' : ''}
            >
              {task.title}
            </button>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="border px-2 py-1"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

