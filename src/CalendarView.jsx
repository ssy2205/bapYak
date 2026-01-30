import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, parseISO, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ appointments, onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getAppointmentStatus = (date) => {
    const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), date) && !app.isHidden);
    if (dayAppointments.length === 0) return null;

    const hasAvailable = dayAppointments.some(app => app.participants.length < app.maxCount);
    const hasFull = dayAppointments.some(app => app.participants.length === app.maxCount);

    if (hasAvailable) return 'available';
    if (hasFull) return 'full';
    return null;
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 px-2">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 border-[1.5px] border-black rounded-none hover:bg-black hover:text-white transition-colors">
        <ChevronLeft size={24} className="text-black" />
      </button>
      <h2 className="text-xl font-bold text-black tracking-tight">
        {format(currentMonth, 'yyyy년 M월', { locale: ko })}
      </h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border-[1.5px] border-black rounded-none hover:bg-black hover:text-white transition-colors">
        <ChevronRight size={24} className="text-black" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-bold text-black mb-2 border-b border-black">
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
      const weekDays = []; // 날짜들을 담을 바구니
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(cloneDay, new Date());
        const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);
        const appointmentStatus = getAppointmentStatus(cloneDay);

        weekDays.push(
          <div
            key={cloneDay.toISOString()}
            onClick={() => onDateSelect(cloneDay)}
            className={`
              relative flex-1 h-full border-[1px] border-black cursor-pointer transition-all duration-500 ease-in-out
              ${!isSameMonth(cloneDay, currentMonth) ? 'bg-gray-100 text-gray-300' : 'bg-white text-black'}
              ${isSelected
                ? 'bg-white text-black z-50 translate-x-[-4px] translate-y-[-4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                : appointmentStatus === 'available'
                  ? 'bg-[#E8EDFF] text-black z-10'
                  : isToday
                    ? 'bg-[#fffbf0] text-black z-10' // 오늘 날짜: 아이보리 배경
                    : !isSameMonth(cloneDay, currentMonth)
                      ? 'bg-gray-100 text-gray-300'
                      : 'bg-white text-black hover:bg-gray-50 z-10'}
            `}
          >


            <span className="text-lg font-bold">{format(cloneDay, 'd')}</span>

            {appointmentStatus === 'available' && (
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#f95c5c',
                  borderRadius: '50%',
                  zIndex: 60
                }}
                title="참여 가능"
              />
            )}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        /* ★ weekDays 변수를 사용하여 한 주를 구성 */
        <div className="flex-1 grid grid-cols-7" key={day.toISOString()}>
          {weekDays}
        </div>
      );
    }
    /* ★ 전체 높이를 채우기 위해 flex-1 flex-col 적용 */
    return <div className="flex-1 flex flex-col border-t border-black">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-none p-6 shadow-xl border-[1.5px] border-black h-full flex flex-col">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}