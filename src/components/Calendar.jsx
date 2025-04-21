import { useState, useEffect, useRef } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from '../styles/Calendar.module.css';

const Calendar = ({ isOpen, onClose, onSelect, initialDate = new Date(), targetElement }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isHiding, setIsHiding] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);
  const [pendingSelect, setPendingSelect] = useState(null);
  const [isPositioned, setIsPositioned] = useState(false);
  const isClosingRef = useRef(false);
  const calendarRef = useRef(null);
  const year = 2025; // Fixed year

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = (e) => setIsPortrait(e.matches);

    mediaQuery.addEventListener('change', handleOrientationChange);
    return () => mediaQuery.removeEventListener('change', handleOrientationChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        closeWithAnimation();
      }
    };

    const positionCalendar = () => {
      if (!targetElement || !calendarRef.current) return;

      // В портретной ориентации на мобильных позиционирование через CSS
      if (window.innerWidth <= 768 && isPortrait) {
        setPosition({ top: '50%', left: '50%' });
      } else {
        const rect = targetElement.getBoundingClientRect();
        const calendarRect = calendarRef.current.getBoundingClientRect();

        let top = rect.top;
        let left = rect.right - calendarRect.width;

        // If calendar would go off screen at the top
        if (top < 0) {
          top = 8;
        }

        // If calendar would go off screen at the bottom
        if (top + calendarRect.height > window.innerHeight) {
          top = window.innerHeight - calendarRect.height - 8;
        }

        // If not enough space on the left, align with left edge
        if (left < 0) {
          left = rect.left;
        }

        setPosition({ top, left });
      }

      // После установки позиции добавляем небольшую задержку перед показом
      requestAnimationFrame(() => {
        setIsPositioned(true);
      });
    };

    const handleScroll = () => {
      closeWithAnimation();
    };

    if (isOpen) {
      setPendingSelect(null);
      isClosingRef.current = false;
      setIsPositioned(false); // Сбрасываем флаг при открытии
      document.addEventListener('mousedown', handleClickOutside);
      positionCalendar();
      window.addEventListener('resize', positionCalendar);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', positionCalendar);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose, targetElement, isPortrait]);

  const closeWithAnimation = (selectedDay = null) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsHiding(true);
    // сохраняем выбранную дату в локальную переменную
    const dayToSelect = selectedDay;
    setTimeout(() => {
      setIsHiding(false);
      if (dayToSelect) {
        onSelect(dayToSelect);
      }
      onClose();
      isClosingRef.current = false;
    }, 200);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
  };

  const handleDateSelect = (day) => {
    closeWithAnimation({ day, month: currentMonth + 1, year });
  };

  if (!isOpen && !isHiding) return null;

  const daysInMonth = getDaysInMonth(currentMonth, year);
  const firstDay = getFirstDayOfMonth(currentMonth, year);
  const days = [];
  const today = new Date();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() &&
      currentMonth === today.getMonth() &&
      year === today.getFullYear();

    days.push(
      <div
        key={day}
        className={`${styles.day} ${isToday ? styles.today : ''}`}
        onClick={() => handleDateSelect(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${(isOpen && isPositioned) ? styles.visible : ''} ${isHiding ? styles.hiding : ''}`}
        onClick={() => closeWithAnimation()}
      />
      <div
        className={`${styles.calendarWrapper} ${(isOpen && isPositioned) ? styles.visible : ''} ${isHiding ? styles.hiding : ''}`}
        ref={calendarRef}
        style={{
          top: position.top + (typeof position.top === 'number' ? 'px' : ''),
          left: position.left + (typeof position.left === 'number' ? 'px' : '')
        }}
      >
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth}>
            <FaAngleLeft />
          </button>
          <span>{months[currentMonth]}</span>
          <button onClick={handleNextMonth}>
            <FaAngleRight />
          </button>
        </div>
        <div className={styles.weekDays}>
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div className={styles.daysGrid}>
          {days}
        </div>
      </div>
    </>
  );
};

export default Calendar;