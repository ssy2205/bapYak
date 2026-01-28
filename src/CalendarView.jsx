import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, parseISO, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';

export default function CalendarView({ appointments, onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getAppointmentStatus = (date) => {
    const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), date) && !app.isHidden);
    console.log(`Checking date: ${format(date, 'yyyy-MM-dd')}, Appointments found: ${dayAppointments.length}`);
    if (dayAppointments.length === 0) {
      console.log(`  No appointments for ${format(date, 'yyyy-MM-dd')}`);
      return null;
    }

    const hasAvailable = dayAppointments.some(app => {
      const isAvailable = app.participants.length < app.maxCount;
      console.log(`  App ${app.id}: participants=${app.participants.length}, maxCount=${app.maxCount}, available=${isAvailable}`);
      return isAvailable;
    });
    const hasFull = dayAppointments.some(app => app.participants.length === app.maxCount);

    if (hasAvailable) {
      console.log(`  Status for ${format(date, 'yyyy-MM-dd')}: available`);
      return 'available';
    }
    if (hasFull) {
      console.log(`  Status for ${format(date, 'yyyy-MM-dd')}: full`);
      return 'full';
    }
    console.log(`  Status for ${format(date, 'yyyy-MM-dd')}: none (neither available nor full)`);
    return null;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-none hover:bg-gray-100 transition-colors border-2 border-black">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h2 className="text-xl font-bold text-black">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-none hover:bg-gray-100 transition-colors border-2 border-black">
          <ChevronRight size={24} className="text-black" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-black mb-2">
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
        const isSelected = selectedDate && isSameDay(cloneDay, selectedDate); // Check if selectedDate is not null
        const appointmentStatus = getAppointmentStatus(cloneDay);

        let dotColorClass = '';
        if (appointmentStatus === 'available') dotColorClass = 'text-red-500';
        else if (appointmentStatus === 'full') dotColorClass = 'text-green-500';

        weekDays.push(
          <div
            key={cloneDay.toISOString()}
            className={`p-2 text-center cursor-pointer rounded-none transition-all duration-200 border-2 border-white
              ${!isSameMonth(cloneDay, currentMonth) ? 'text-gray-300' : 'text-black'}
              ${isToday ? 'font-bold border-black' : ''}
              ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}
              relative flex flex-col items-center justify-center`}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span>{format(cloneDay, 'd')}</span>
            {appointmentStatus === 'available' && <div className="w-4 h-4 rounded-full bg-red-500 absolute top-1 right-1 z-50 border-2 border-black" />}
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
    <div className="bg-white rounded-none p-6 shadow-xl border-2 border-black h-full flex flex-col">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}