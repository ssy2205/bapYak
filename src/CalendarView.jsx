import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // Import Korean locale
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';

export default function CalendarView({ appointments, onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to get appointment status for a date
  const getAppointmentStatus = (date) => {
    const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), date) && !app.isHidden);
    if (dayAppointments.length === 0) return null; // No appointments

    const hasAvailable = dayAppointments.some(app => app.participants.length < app.maxCount);
    const hasFull = dayAppointments.some(app => app.participants.length === app.maxCount);

    if (hasAvailable && hasFull) return 'mixed'; // Both available and full
    if (hasAvailable) return 'available'; // Only available
    if (hasFull) return 'full'; // Only full
    return null;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일']; // Monday to Sunday
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
        {days.map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start week on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // End week on Sunday

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const appointmentStatus = getAppointmentStatus(day);

        let dotColorClass = '';
        if (appointmentStatus === 'available') dotColorClass = 'text-red-500';
        else if (appointmentStatus === 'full') dotColorClass = 'text-green-500';
        else if (appointmentStatus === 'mixed') dotColorClass = 'text-blue-500'; // Mixed status dot

        days.push(
          <div
            key={cloneDay.toISOString()}
            className={`p-2 text-center cursor-pointer rounded-full transition-all duration-200
              ${!isSameMonth(cloneDay, currentMonth) ? 'text-gray-300' : 'text-gray-700'}
              ${isToday ? 'font-bold text-orange-500 border-2 border-orange-500' : ''}
              ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}
              relative flex flex-col items-center justify-center`}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span>{formattedDate}</span>
            {appointmentStatus && <Dot size={16} className={`${dotColorClass} absolute bottom-0.5`} />}
          </div>
        );
        day = new Date(day.setDate(day.getDate() + 1));
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-orange-100 mb-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
