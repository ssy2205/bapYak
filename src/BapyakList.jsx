import React, { useState } from 'react';
import { Sun, Moon, Instagram, EyeOff, Lock, Key } from 'lucide-react';

export default function BapyakList({ appointments, showOnlyAvailable, onJoinClick, onHideClick }) {
  const [pinInputs, setPinInputs] = useState({});
  const [visibleParticipants, setVisibleParticipants] = useState({});
  const [pinErrors, setPinErrors] = useState({});

  // Filter out hidden appointments first
  const visibleAppointments = appointments.filter(app => !app.isHidden);

  const appointmentsToDisplay = showOnlyAvailable
    ? visibleAppointments.filter((app) => app.participants.length < app.maxCount)
    : visibleAppointments;

  const handlePinInputChange = (appId, value) => {
    setPinInputs(prev => ({ ...prev, [appId]: value }));
    if (pinErrors[appId]) {
      setPinErrors(prev => ({...prev, [appId]: ''}));
    }
  };

  const handlePinCheck = (appId, correctPin) => {
    const inputPin = pinInputs[appId] || '';
    if (inputPin === correctPin) {
      setVisibleParticipants(prev => ({ ...prev, [appId]: true }));
      setPinErrors(prev => ({...prev, [appId]: ''}));
    } else {
      setPinErrors(prev => ({...prev, [appId]: 'PIN 번호가 일치하지 않아요.'}));
    }
  };

  if (visibleAppointments.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">등록된 밥약이 없어요 🥲</p>
        <p>첫 번째 밥약을 만들어보세요!</p>
      </div>
    );
  }
  
  if (appointmentsToDisplay.length === 0 && showOnlyAvailable) {
     return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">모든 밥약이 정원 마감되었어요! 😅</p>
        <p>필터를 해제하고 전체 밥약을 확인해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {appointmentsToDisplay.map((app) => {
        const isFull = app.participants.length >= app.maxCount;
        const isParticipantsVisible = visibleParticipants[app.id];

        return (
          <div
            key={app.id}
            className={`bg-white rounded-[2.5rem] p-7 shadow-lg border border-orange-50/50 relative overflow-hidden transition-opacity ${isFull ? 'opacity-60' : ''}`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-2 ${
                app.timeSlot === 'Lunch' ? 'bg-orange-400' : 'bg-blue-400'
              }`}
            ></div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onHideClick(app);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <EyeOff size={20} />
            </button>

            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {app.name}{' '}
                  <span className="text-base font-medium text-gray-400">
                    ({app.studentId}학번)
                  </span>
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-bold flex items-center gap-1">
                    🗓 {app.date}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                      app.timeSlot === 'Lunch'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {app.timeSlot === 'Lunch' ? <Sun size={14} /> : <Moon size={14} />}
                    {app.timeSlot === 'Lunch' ? '점심' : '저녁'}
                  </span>
                </div>
              </div>
              <div className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-colors ${isFull ? 'bg-gray-100' : 'bg-orange-50'}`}>
                <span className={`text-xs font-bold transition-colors ${isFull ? 'text-gray-400' : 'text-orange-400'}`}>참여 현황</span>
                <span className={`text-2xl font-black transition-colors ${isFull ? 'text-gray-400' : 'text-orange-500'}`}>
                  {app.participants.length}
                  <span className="text-gray-300">/</span>
                  {app.maxCount}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 bg-gray-50 p-5 rounded-3xl leading-relaxed">
              {app.intro}
            </p>

            <div className="mb-6">
              <p className="text-sm font-bold text-gray-400 mb-3 ml-1">참여 멤버</p>
              {isParticipantsVisible ? (
                <div className="flex flex-col gap-2 animate-fade-in">
                  {app.participants.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">{p.name[0]}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">
                          {p.name} <span className="text-xs font-normal text-gray-400">({p.studentId})</span>
                          {p.isHost && <span className="ml-1 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full">HOST</span>}
                        </span>
                        {!p.isHost && p.instaId && <span className="text-xs text-gray-400 flex items-center gap-1"><Instagram size={10}/> {p.instaId}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="password"
                        placeholder="PIN 입력"
                        maxLength="4"
                        value={pinInputs[app.id] || ''}
                        onChange={(e) => handlePinInputChange(app.id, e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <button 
                      onClick={() => handlePinCheck(app.id, app.pin)}
                      className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Key size={16}/> 확인
                    </button>
                  </div>
                  {pinErrors[app.id] && <p className="text-red-500 text-xs text-center mt-2">{pinErrors[app.id]}</p>}
                </div>
              )}
            </div>

            <button
              onClick={() => onJoinClick(app.id)}
              disabled={isFull}
              className="w-full text-white py-5 rounded-[2rem] font-bold text-lg active:scale-[0.98] transition-all shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed bg-gray-900 hover:bg-gray-800 shadow-gray-200"
            >
              {isFull ? '정원 마감' : '나도 참여할래! 🙋‍♂️'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
