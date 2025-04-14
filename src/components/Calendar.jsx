import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from '../styles/Calendar.module.css';

const Calendar = ({ isOpen, onClose, onSelect, initialDate = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const calendarRef = useRef(null);
  const year = 2025; // Fixed year

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (isOpen && calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      const calendarHeight = rect.height;
      const spaceBelow = window.innerHeight - rect.top;
      if (spaceBelow < calendarHeight) {
        calendarRef.current.style.top = "auto";
        calendarRef.current.style.bottom = "0%";
      } else {
        calendarRef.current.style.top = "0%";
        calendarRef.current.style.bottom = "auto";
      }
    }
  }, [isOpen, currentMonth]);

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
    onSelect({
      day,
      month: currentMonth + 1,
      year
    });
    onClose();
  };

  if (!isOpen) return null;

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
    <div className={styles.calendarWrapper} ref={calendarRef}>
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
  );
};

export default Calendar;