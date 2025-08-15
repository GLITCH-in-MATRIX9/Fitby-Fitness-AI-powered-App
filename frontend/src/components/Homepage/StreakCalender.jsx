import React, { useState } from "react";
import { Link } from "react-router-dom";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const StreakCalendar = ({ streakData }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calculateStreak = () => {
    let streak = 0;
    let dayPointer = new Date(currentYear, currentMonth, today.getDate());
    while (streakData[formatDate(dayPointer)]) {
      streak++;
      dayPointer.setDate(dayPointer.getDate() - 1);
    }
    return streak;
  };

  const streak = calculateStreak();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = [];
  let dayCounter = 1 - firstDay;

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (dayCounter < 1 || dayCounter > daysInMonth) {
        days.push(null);
      } else {
        days.push(dayCounter);
      }
      dayCounter++;
    }
    calendarDays.push(days);
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "short",
  });

  return (
    <div className="min-w-[320px] bg-gray-900 text-white rounded-lg p-6 font-sans select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="text-orange-400 hover:text-orange-500 px-2"
          aria-label="Previous Month"
        >
          ‹
        </button>
        <div className="font-semibold text-lg flex items-center gap-2">
          <span>Day {streak}</span>
          <span className="text-xs text-orange-300">
            {today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} left
          </span>
          <div
            className="rounded-full px-3 py-1 font-bold text-sm"
            style={{ backgroundColor: "#F97316", color: "#000" }} // orange bg with black text
          >
            {today.getDate()} {monthName.toUpperCase()}
          </div>
        </div>
        <button
          onClick={nextMonth}
          className="text-orange-400 hover:text-orange-500 px-2"
          aria-label="Next Month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-orange-400 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.flat().map((day, idx) => {
          if (!day) {
            return <div key={idx} className="h-8"></div>;
          }
          const dayDate = new Date(currentYear, currentMonth, day);
          const dayKey = formatDate(dayDate);
          const completed = streakData[dayKey];
          const isToday = dayDate.toDateString() === new Date().toDateString();

          return (
            <Link
              key={idx}
              to={`/streak/${dayKey}`}
              className={`h-8 w-8 rounded flex items-center justify-center
                ${
                  completed
                    ? "bg-orange-500 text-black"
                    : "bg-gray-800 text-orange-400"
                }
                ${isToday ? "border-2 border-yellow-400" : ""}
                hover:bg-orange-600 hover:text-black
                transition-colors
              `}
              title={`${dayKey}${completed ? " - Completed" : ""}`}
            >
              {completed ? "✔" : day}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StreakCalendar;
