import './styles/fonts.css'
import './styles/theme.css'
import styles from './styles/App.module.css'
import { FaPlus } from "react-icons/fa6"
import { useCallback, useState, useRef } from 'react'
import KanbanBoard from './KanbanBoard'

function App() {
  const boardRef = useCallback((node) => {
    if (node) {
      window.kanbanBoard = node;
    }
  }, []);

  const boardContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleCreateTask = () => {
    if (window.kanbanBoard?.handleAddTask) {
      window.kanbanBoard.handleAddTask();
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    boardContainerRef.current.dataset.touchStartX = touch.clientX;
  };

  const handleTouchMove = (e) => {
    if (!boardContainerRef.current.dataset.touchStartX) return;

    const touch = e.touches[0];
    const startX = parseFloat(boardContainerRef.current.dataset.touchStartX);
    const currentX = touch.clientX;
    const diff = startX - currentX;

    boardContainerRef.current.scrollLeft += diff;
    boardContainerRef.current.dataset.touchStartX = currentX;
  };

  const handleTouchEnd = () => {
    delete boardContainerRef.current.dataset.touchStartX;
  };

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.createButton} onClick={handleCreateTask}>
          <span>Создать задачу</span>
          <FaPlus />
        </button>
        <div className={styles.scrollIndicator}>
          <div
            className={styles.scrollProgress}
            style={{
              width: boardContainerRef.current
                ? `${(scrollPosition / (boardContainerRef.current.scrollWidth - boardContainerRef.current.clientWidth)) * 100}%`
                : '0%'
            }}
          />
        </div>
      </header>
      <div
        ref={boardContainerRef}
        className={styles.appContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
      >
        <KanbanBoard ref={boardRef} />
        <div className={styles.footer}>
          Настоящий веб-сайт разработан в рамках индивидуального проекта<br/>Кречетов Илья, МБОУ СОШ №3, Бийск 2025
        </div>
      </div>
    </>
  )
}

export default App
