import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import styles from './styles/KanbanBoard.module.css'
import Column from './Column'
import { initialData } from './initialData'

const KanbanBoard = forwardRef(function KanbanBoard(props, ref) {
  const [board, setBoard] = useState(initialData)
  const [activeColumnIndex, setActiveColumnIndex] = useState(0)
  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const startTranslateX = useRef(0)
  const currentTranslateX = useRef(0)
  const animationFrameId = useRef(null)
  const boardInnerRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: portrait)')
    const handleOrientationChange = (e) => {
      setIsPortrait(e.matches)
      if (!e.matches) {
        // Reset position when switching to landscape
        if (boardInnerRef.current) {
          boardInnerRef.current.style.transform = 'translateX(0)'
        }
      } else {
        // Update position when switching to portrait
        updatePosition(activeColumnIndex)
      }
    }

    mediaQuery.addEventListener('change', handleOrientationChange)
    return () => mediaQuery.removeEventListener('change', handleOrientationChange)
  }, [activeColumnIndex])

  const handleTouchStart = (e) => {
    if (!isPortrait) return
    setIsDragging(true)
    dragStartX.current = e.touches[0].clientX
    startTranslateX.current = -activeColumnIndex * 100
    currentTranslateX.current = startTranslateX.current
    if (boardInnerRef.current) boardInnerRef.current.style.transition = 'none'
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !isPortrait) return
    const currentX = e.touches[0].clientX
    const diff = currentX - dragStartX.current

    // Учитываем полную ширину колонки включая gap
    const columnWidth = boardInnerRef.current?.offsetWidth || 1
    const percentageMoved = (diff / columnWidth) * 100

    // Рассчитываем новую позицию
    let newTranslate = startTranslateX.current + percentageMoved

    // Ограничиваем движение
    const maxTranslate = 0
    const minTranslate = -((board.columnOrder.length - 1) * 100)

    newTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate))
    currentTranslateX.current = newTranslate

    if (boardInnerRef.current) {
      boardInnerRef.current.style.transform = `translateX(${newTranslate}%)`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || !isPortrait) return
    setIsDragging(false)
    if (boardInnerRef.current) {
      boardInnerRef.current.style.transition = 'transform 0.3s cubic-bezier(.4,1.3,.5,1)'
    }

    // Округляем до ближайшей колонки
    const finalTranslate = currentTranslateX.current
    let index = Math.round(-finalTranslate / 100)
    index = Math.max(0, Math.min(board.columnOrder.length - 1, index))
    setActiveColumnIndex(index)

    // Устанавливаем точную позицию
    if (boardInnerRef.current) {
      boardInnerRef.current.style.transform = `translateX(-${index * 100}%)`
    }
  }

  const updatePosition = (index) => {
    if (boardInnerRef.current && isPortrait && !isDragging) {
      boardInnerRef.current.style.transition = 'transform 0.3s cubic-bezier(.4,1.3,.5,1)'
      boardInnerRef.current.style.transform = `translateX(-${index * 100}%)`
    }
  }

  useEffect(() => {
    updatePosition(activeColumnIndex)
  }, [activeColumnIndex, isPortrait])

  const handleMoveToNext = (newTask, currentPosition, direction = 'right') => {
    let targetColumnIndex

    if (direction === 'complete') {
      targetColumnIndex = board.columnOrder.length - 1 // последний столбец
    } else if (currentPosition === 'middle') {
      targetColumnIndex = direction === 'left' ? 0 : 2
    } else if (currentPosition === 'start') {
      targetColumnIndex = 1
    } else if (currentPosition === 'end') {
      targetColumnIndex = 1
    } else {
      return
    }

    const targetColumnId = board.columnOrder[targetColumnIndex]

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
    }))
  }

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
    }))
  }

  useImperativeHandle(ref, () => ({
    handleAddTask
  }))

  return (
    <div
      className={styles.boardContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.boardInner} ref={boardInnerRef}>
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
            isActive={!isPortrait || index === activeColumnIndex}
          />
        ))}
      </div>
    </div>
  )
})

export default KanbanBoard
