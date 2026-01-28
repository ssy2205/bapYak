import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, parseISO, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';

export default function CalendarView({ appointments, onDateSelect, selectedDate, isFullScreen }) { // Added isFullScreen prop
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getAppointmentStatus = (date) => {
    const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), date) && !app.isHidden);
    if (dayAppointments.length === 0) return null;

    const hasAvailable = dayAppointments.some(app => app.participants.length < app.maxCount);
    const hasFull = dayAppointments.some(app => app.participants.length === app.maxCount);

    if (hasAvailable && hasFull) return 'mixed';
    if (hasAvailable) return 'available';
    if (hasFull) return 'full';
    return null;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
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
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const isToday = isSameDay(cloneDay, new Date());
        const isSelected = isSameDay(cloneDay, selectedDate);
        const appointmentStatus = getAppointmentStatus(cloneDay);

        let dotColorClass = '';
        if (appointmentStatus === 'available') dotColorClass = 'text-red-500';
        else if (appointmentStatus === 'full') dotColorClass = 'text-green-500';
        else if (appointmentStatus === 'mixed') dotColorClass = 'text-blue-500';

        weekDays.push(
          <div
            key={cloneDay.toISOString()}
            className={`p-2 text-center cursor-pointer rounded-md transition-all duration-200
              ${!isSameMonth(cloneDay, currentMonth) ? 'text-gray-300' : 'text-gray-800'}
              ${isToday ? 'font-bold border-2 border-black' : ''}
              ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}
              relative flex flex-col items-center justify-center`}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span>{format(cloneDay, 'd')}</span>
            {appointmentStatus && <Dot size={16} className={`${dotColorClass} absolute bottom-0.5`} />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {weekDays}
        </div>
      );
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className={`bg-white rounded-none p-6 shadow-xl border border-gray-200 transition-all duration-500 ${isFullScreen ? 'h-full flex flex-col justify-center' : 'mb-6'}`}> {/* Added dynamic height and flex */}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

