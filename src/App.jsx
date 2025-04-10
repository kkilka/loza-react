import './styles/fonts.css'
import './styles/theme.css'
import styles from './styles/App.module.css'
import { FaPlus } from "react-icons/fa6"
import { useCallback } from 'react'
import KanbanBoard from './KanbanBoard'

function App() {
  const boardRef = useCallback((node) => {
    if (node) {
      window.kanbanBoard = node;
    }
  }, []);

  const handleCreateTask = () => {
    if (window.kanbanBoard?.handleAddTask) {
      window.kanbanBoard.handleAddTask();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.createButton} onClick={handleCreateTask}>
          <span>Создать задачу</span>
          <FaPlus />
        </button>
      </header>
      <div className={styles.appContainer}>
        <KanbanBoard ref={boardRef} />
      </div>
    </>
  )
}

export default App
