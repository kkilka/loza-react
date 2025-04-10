import { useState, forwardRef, useImperativeHandle } from 'react'
import styles from './styles/KanbanBoard.module.css'
import Column from './Column'
import { initialData } from './initialData'

const KanbanBoard = forwardRef(function KanbanBoard(props, ref) {
  const [board, setBoard] = useState(initialData)

  const handleMoveToNext = (newTask, currentPosition, direction = 'right') => {
    let targetColumnIndex;
    
    if (direction === 'complete') {
      targetColumnIndex = board.columnOrder.length - 1; // последний столбец
    } else if (currentPosition === 'middle') {
      targetColumnIndex = direction === 'left' ? 0 : 2;
    } else if (currentPosition === 'start') {
      targetColumnIndex = 1;
    } else if (currentPosition === 'end') {
      targetColumnIndex = 1;
    } else {
      return;
    }

    const targetColumnId = board.columnOrder[targetColumnIndex];
    
    setBoard(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [newTask.id]: newTask
      },
      columns: {
        ...prev.columns,
        [targetColumnId]: {
          ...prev.columns[targetColumnId],
          taskIds: [newTask.id, ...prev.columns[targetColumnId].taskIds]
        }
      }
    }));
  };

  const handleAddTask = () => {
    const newTaskId = `task-${Date.now()}`
    setBoard(prev => {
      const firstColumnId = prev.columnOrder[0]
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [newTaskId]: {
            id: newTaskId,
            title: 'Название',
            description: 'Описание...',
            createdAt: new Date().toISOString(),
            deadline: {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1
            },
            difficulty: 0.3,
            timeEstimate: 2
          }
        },
        columns: {
          ...prev.columns,
          [firstColumnId]: {
            ...prev.columns[firstColumnId],
            taskIds: [newTaskId, ...prev.columns[firstColumnId].taskIds]
          }
        }
      }
    })
  }

  const handleTaskUpdate = (taskId, updates) => {
    setBoard(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          ...updates
        }
      }
    }));
  };

  useImperativeHandle(ref, () => ({
    handleAddTask
  }));

  return (
    <div className={styles.boardContainer}>
      {board.columnOrder.map((columnId, index) => (
        <Column 
          key={columnId}
          id={columnId}
          column={board.columns[columnId]}
          tasks={board.columns[columnId].taskIds.map(id => board.tasks[id])}
          onMoveToNext={handleMoveToNext}
          columnPosition={index === 0 ? 'start' : index === board.columnOrder.length - 1 ? 'end' : 'middle'}
          onAddTask={index === 0 ? handleAddTask : undefined}
          onTaskUpdate={handleTaskUpdate}
        />
      ))}
    </div>
  )
});

export default KanbanBoard
