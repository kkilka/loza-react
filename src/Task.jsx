import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './styles/Task.module.css'
import { FaTrash, FaPen, FaArrowRightLong, FaArrowLeftLong, FaCheck, FaPenToSquare } from "react-icons/fa6"
import texts from './locales/ru.json'
import Calendar from './components/Calendar';

function Task({ task, onMoveToNext, columnPosition, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [dateClickRef, setDateClickRef] = useState(null);
  const titleRef = useRef(null)
  const markerRef = useRef(null)
  const [isAppearing, setIsAppearing] = useState(true)
  const [editingField, setEditingField] = useState(null)

  useEffect(() => {
    const updateMarkerHeight = () => {
      if (titleRef.current && markerRef.current) {
        const titleHeight = titleRef.current.offsetHeight;
        markerRef.current.style.height = `${titleHeight}px`;
      }
    };

    updateMarkerHeight();
    const resizeObserver = new ResizeObserver(updateMarkerHeight);
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppearing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      setIsDeleting(true);
      setTimeout(() => {
        onUpdate(task.id, { deleted: true });
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const handleMoveButtonClick = (direction) => {
    const removeDuration = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--task-remove-duration')) * 1000 || 400;

    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: task.createdAt,
      deadline: task.deadline,
      difficulty: task.difficulty,
      timeEstimate: task.timeEstimate
    };

    onMoveToNext(newTask, columnPosition, direction);
    setIsDeleting(true);

    setTimeout(() => {
      onUpdate(task.id, { deleted: true });
    }, removeDuration);
  };

  const handleCompleteTask = () => {
    const removeDuration = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--task-remove-duration')) * 1000 || 400;

    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: task.createdAt,
      deadline: task.deadline,
      difficulty: task.difficulty,
      timeEstimate: task.timeEstimate
    };

    onMoveToNext(newTask, columnPosition, 'complete');
    setIsDeleting(true);

    setTimeout(() => {
      onUpdate(task.id, { deleted: true });
    }, removeDuration);
  };

  const handleContentBlur = (e, field) => {
    const newValue = e.target.textContent;
    if (newValue !== task[field]) {
      onUpdate(task.id, { [field]: newValue });
    }
    setEditingField(null);
  };

  const handleTimeEstimateClick = (e) => {
    const text = e.currentTarget;
    const textContent = text.textContent;
    const numberMatch = textContent.match(/\d+/);
    if (numberMatch) {
      const range = document.createRange();
      const selection = window.getSelection();
      const startPos = textContent.indexOf(numberMatch[0]);
      const endPos = startPos + numberMatch[0].length;

      range.setStart(text.firstChild, startPos);
      range.setEnd(text.firstChild, endPos);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleTimeEstimateInput = (e) => {
    const numberMatch = e.target.textContent.match(/\d+/);
    if (numberMatch) {
      const hours = parseInt(numberMatch[0], 10);
      const lastDigit = hours % 10;
      const lastTwoDigits = hours % 100;

      let suffix;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        suffix = 'часов';
      } else if (lastDigit === 1) {
        suffix = 'час';
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        suffix = 'часа';
      } else {
        suffix = 'часов';
      }

      const text = e.target.textContent;
      const newText = text.replace(/час(а|ов)?/, suffix);
      if (text !== newText) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const start = range.startOffset;
        e.target.textContent = newText;
        range.setStart(e.target.firstChild, start);
        range.setEnd(e.target.firstChild, start);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleTimeEstimateBlur = (e) => {
    const newValue = e.target.textContent.match(/\d+/)?.[0];
    if (newValue && newValue !== String(task.timeEstimate)) {
      onUpdate(task.id, { timeEstimate: parseInt(newValue, 10) });
    }
    e.target.textContent = formatTimeEstimate(task.timeEstimate);
  };

  const handleContentKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const fieldOrder = ['title', 'description', 'timeEstimate'];
      const currentIndex = fieldOrder.indexOf(field);

      if (currentIndex === fieldOrder.length - 1) {
        e.target.blur();
        setEditingField(null);
      } else {
        const nextField = fieldOrder[currentIndex + 1];
        const elements = {
          title: titleRef.current,
          description: document.querySelector(`.${styles.taskDescription}`),
          timeEstimate: document.querySelector(`.${styles.timeEstimate}`)
        };

        if (nextField === 'timeEstimate') {
          // Select number in timeEstimate field
          const timeElement = elements[nextField];
          timeElement?.focus();
          const textContent = timeElement.textContent;
          const numberMatch = textContent.match(/\d+/);
          if (numberMatch) {
            const range = document.createRange();
            const selection = window.getSelection();
            const startPos = textContent.indexOf(numberMatch[0]);
            const endPos = startPos + numberMatch[0].length;

            range.setStart(timeElement.firstChild, startPos);
            range.setEnd(timeElement.firstChild, endPos);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } else {
          elements[nextField]?.focus();
        }
      }
    }
  };

  const handleDeadlineChange = (date) => {
    if (date) {
      onUpdate(task.id, { deadline: date });
    }
    setIsDatePickerOpen(false);
    setDateClickRef(null);
  };

  if (task.deleted) return null;

  const className = `
    ${styles.taskCard} 
    ${isDeleting ? styles.deleting : ''}
    ${isAppearing ? styles.appearing : ''}
  `.trim()

  const getDifficultyClass = (barIndex) => {
    const difficulty = task.difficulty || 0;
    let isActive = false;
    if (difficulty <= 0.33) {
      isActive = (barIndex === 0);
    } else if (difficulty <= 0.66) {
      isActive = (barIndex <= 1);
    } else {
      isActive = (barIndex <= 2);
    }
    let classes = [styles.difficultyBar];
    if (difficulty <= 0.33) {
      classes.push(styles.difficultyBarEasy);
    } else if (difficulty <= 0.66) {
      classes.push(styles.difficultyBarMedium);
    } else {
      classes.push(styles.difficultyBarHard);
    }
    classes.push(isActive ? styles.filled : styles.empty);
    return classes.join(' ');
  };

  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const formatTimeEstimate = (hours) => {
    const lastDigit = hours % 10;
    const lastTwoDigits = hours % 100;

    let suffix;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      suffix = 'часов';
    } else if (lastDigit === 1) {
      suffix = 'час';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      suffix = 'часа';
    } else {
      suffix = 'часов';
    }

    return `~${hours} ${suffix}`;
  };

  const formatDeadline = (deadline) => `до ${deadline.day} ${months[deadline.month - 1]}`;

  const getRemainingDays = () => {
    if (!task.deadline) return 0;
    const now = new Date();
    const deadlineDate = new Date(2025, task.deadline.month - 1, task.deadline.day);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgress = () => {
    if (!task.deadline || !task.createdAt) return 0;
    const now = new Date();
    const created = new Date(task.createdAt);
    const deadline = new Date(2025, task.deadline.month - 1, task.deadline.day);

    const totalDuration = deadline - created;
    const elapsedTime = now - created;

    const progress = Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);
    return progress;
  };

  const daysRemaining = getRemainingDays();
  const progress = getProgress();

  return (
    <div className={styles.taskWrapper}>
      <div className={styles.taskShadow} />
      <div className={`${className} ${styles.taskContainer}`}>
        <div className={styles.taskContent}>
          <div className={styles.taskLeftMarker} ref={markerRef} />
          <div className={`${styles.taskTextContent} ${editingField ? styles.editing : ''}`}>
            <h3
              ref={titleRef}
              className={styles.taskTitle}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setEditingField('title')}
              onBlur={(e) => handleContentBlur(e, 'title')}
              onKeyDown={(e) => handleContentKeyDown(e, 'title')}
            >
              {task.title}
            </h3>
            <p
              className={styles.taskDescription}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setEditingField('description')}
              onBlur={(e) => handleContentBlur(e, 'description')}
              onKeyDown={(e) => handleContentKeyDown(e, 'description')}
            >
              {task.description}
            </p>
            <div className={styles.difficultyContainer}>
              <div className={styles.timingInfo}>
                <span
                  className={styles.timeEstimate}
                  contentEditable
                  suppressContentEditableWarning
                  onClick={handleTimeEstimateClick}
                  onInput={handleTimeEstimateInput}
                  onFocus={() => setEditingField('timeEstimate')}
                  onBlur={(e) => {
                    handleTimeEstimateBlur(e);
                    setEditingField(null);
                  }}
                  onKeyDown={(e) => handleContentKeyDown(e, 'timeEstimate')}
                >
                  {formatTimeEstimate(task.timeEstimate)}
                </span>
                <div className={styles.datePickerWrapper}>
                  <span
                    className={styles.deadline}
                    onClick={(e) => {
                      setDateClickRef(e.currentTarget);
                      setIsDatePickerOpen(true);
                    }}
                  >
                    {task.deadline ? formatDeadline(task.deadline) : 'Выберите дату'}
                  </span>
                  {isDatePickerOpen && createPortal(
                    <Calendar
                      isOpen={isDatePickerOpen}
                      onClose={() => {
                        setIsDatePickerOpen(false);
                        setDateClickRef(null);
                      }}
                      onSelect={handleDeadlineChange}
                      targetElement={dateClickRef}
                      initialDate={task.deadline ? new Date(2025, task.deadline.month - 1, task.deadline.day) : new Date()}
                    />,
                    document.body
                  )}
                </div>
              </div>
              <div className={styles.difficultyBarsContainer}>
                <span className={getDifficultyClass(0)}></span>
                <span className={getDifficultyClass(1)}></span>
                <span className={getDifficultyClass(2)}></span>
              </div>
            </div>
            <div className={`${styles.taskActions}`}>
              {columnPosition === 'start' ? (
                <div className={styles.taskButtonsRow}>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: 'var(--color-delete-bg)', color: 'var(--color-delete)' }}
                    title={texts.task.buttons.delete}
                    onClick={handleDelete}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: '#d4f7d4', color: '#28a745' }}
                    title={texts.task.buttons.edit}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: '#d4f7d4', color: '#28a745' }}
                    onClick={handleCompleteTask}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className={styles.mainButton}
                    style={{
                      gap: 'var(--main-button-icon-gap)',
                      padding: 'var(--main-button-padding)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => handleMoveButtonClick('right')}
                  >
                    <span>{texts.task.buttons.details[columnPosition]}</span>
                    <FaArrowRightLong />
                  </button>
                </div>
              ) : columnPosition === 'end' ? (
                <div className={styles.taskButtonsRow}>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: 'var(--color-delete-bg)', color: 'var(--color-delete)' }}
                    title={texts.task.buttons.delete}
                    onClick={handleDelete}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: '#d4f7d4', color: '#28a745' }}
                    title={texts.task.buttons.edit}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    className={`${styles.mainButton} ${styles.rightToLeft}`}
                    style={{
                      gap: 'var(--main-button-icon-gap)',
                      padding: 'var(--main-button-padding)',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => handleMoveButtonClick('left')}
                  >
                    <span>{texts.task.buttons.details[columnPosition]}</span>
                    <FaArrowLeftLong />
                  </button>
                </div>
              ) : columnPosition === 'middle' ? (
                <div className={styles.taskButtonsRow}>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: 'var(--color-delete-bg)', color: 'var(--color-delete)' }}
                    title={texts.task.buttons.delete}
                    onClick={handleDelete}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: '#d4f7d4', color: '#28a745' }}
                    title={texts.task.buttons.edit}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    className={styles.iconButton}
                    style={{ backgroundColor: '#d4f7d4', color: '#28a745' }}
                    onClick={() => handleMoveButtonClick('left')}
                  >
                    <FaArrowLeftLong />
                  </button>
                  <button
                    className={styles.mainButton}
                    style={{
                      gap: 'var(--main-button-icon-gap)',
                      padding: 'var(--main-button-padding)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => handleMoveButtonClick('right')}
                  >
                    <span>{texts.task.buttons.details[columnPosition]}</span>
                    <FaArrowRightLong />
                  </button>
                </div>
              ) : null}
            </div>
            <div className={styles.taskStatusContainer}>
              <div
                className={styles.taskStatus}
                style={{ '--progress': `${progress}%` }}
              >
                {`Осталось ${daysRemaining} ${getDaysWord(daysRemaining)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getDaysWord = (days) => {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
};

export default Task
