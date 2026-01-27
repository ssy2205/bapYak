import React, { useState } from 'react';
import { Sun, Moon, Instagram, MoreHorizontal, User, Users, EyeOff, Dot } from 'lucide-react'; // Added Dot
import { format } from 'date-fns';

export default function BapyakList({ appointments, onJoinClick, onHideClick, onCheckMembersClick }) {
  const [openMenuId, setOpenMenuId] = useState(null); // State to manage which menu is open

  if (appointments.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">선택된 날짜에 밥약이 없어요 🥲</p>
        <p>새로운 밥약을 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {appointments.map((app) => {
        const isFull = app.participants.length >= app.maxCount;
        const host = app.participants.find(p => p.isHost);
        const statusDotColor = isFull ? 'text-green-500' : 'text-red-500'; // Green for full, Red for available

        return (
          <div
            key={app.id}
            className={`bg-white rounded-[2.5rem] p-7 shadow-lg border border-orange-50/50 relative overflow-hidden`}
          >
            {/* Top Time Slot Indicator */}
            <div
              className={`absolute top-0 left-0 w-full h-2 ${
                app.timeSlot === 'Lunch' ? 'bg-orange-400' : 'bg-blue-400'
              }`}
            ></div>

            {/* Menu Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === app.id ? null : app.id);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <MoreHorizontal size={20} />
              </button>
              {openMenuId === app.id && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHideClick(app);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <EyeOff size={16} /> 밥약 숨기기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCheckMembersClick(app);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users size={16} /> 참여 멤버 확인
                  </button>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {app.timeSlot === 'Lunch' ? <Sun size={24} className="text-orange-400"/> : <Moon size={24} className="text-blue-400"/>}
                  {app.timeSlot === 'Lunch' ? '점심' : '저녁'}
                  <Dot size={24} className={statusDotColor} /> {/* Status Dot */}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <User size={16} />
                  <span className="font-medium">{host?.name} ({host?.studentId})</span>
                  {host?.instaId && <Instagram size={16} className="ml-1 text-pink-500"/>}
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
