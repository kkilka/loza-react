import styles from './styles/Column.module.css'
import Task from './Task'
import React from 'react'

function Column({ column, tasks, onMoveToNext, columnPosition, onAddTask, onTaskUpdate }) {
  const columnRef = React.useRef(null)

  return (
    <div ref={columnRef} className={styles.columnContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.columnTitle}>
          {column.title}
        </h2>
      </div>
      <div className={styles.taskList}>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onMoveToNext={onMoveToNext}
            columnPosition={columnPosition}
            onUpdate={onTaskUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default Column
