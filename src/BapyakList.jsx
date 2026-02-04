import React, { useState } from 'react';
import { Sun, Moon, Instagram, MoreHorizontal, User, Users, EyeOff, Dot } from 'lucide-react';
import { format } from 'date-fns';

export default function BapyakList({ appointments, onJoinClick, onHideClick, onCheckMembersClick }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (appointments.length === 0) {
    return (
      <div className="text-center py-20 text-black">
        <p className="text-xl">선택된 날짜에 밥약이 없어요.</p>
        <p>새로운 밥약을 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {appointments.map((app) => {
        const seniorCount = app.participants.filter(p => p.role === 'Senior').length;
        const juniorCount = app.participants.filter(p => p.role === 'Junior').length;

        // Backward compatibility: if maxSenior/maxJunior missing, use maxCount/2 or similar logic, or just fallback
        const maxSenior = app.maxSenior || app.maxCount / 2 || 1;
        const maxJunior = app.maxJunior || app.maxCount / 2 || 1;

        const isSeniorFull = seniorCount >= maxSenior;
        const isJuniorFull = juniorCount >= maxJunior;
        const isAbsolutelyFull = isSeniorFull && isJuniorFull;

        const host = app.participants.find(p => p.isHost);
        const statusDotColor = isAbsolutelyFull ? 'text-green-600' : 'text-red-600';

        return (
          <div
            key={app.id}
            className={`bg-white rounded-none p-8 shadow-none border-[1.5px] border-black relative overflow-hidden`}
          >
            {/* Menu Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === app.id ? null : app.id);
                }}
                className="p-2 rounded-none hover:bg-black hover:text-white transition-colors text-black border-[1.5px] border-black"
              >
                <MoreHorizontal size={20} />
              </button>
              {openMenuId === app.id && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-none shadow-lg py-1 z-20 border-[1.5px] border-black">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHideClick(app);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-black hover:bg-black hover:text-white whitespace-nowrap"
                  >
                    <EyeOff size={16} /> 밥약 삭제
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCheckMembersClick(app);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-black hover:bg-black hover:text-white whitespace-nowrap"
                  >
                    <Users size={16} /> 참여 멤버 확인
                  </button>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  {app.timeSlot === 'Lunch' ? <Sun size={20} className="text-black" /> : <Moon size={20} className="text-black" />}
                  {app.timeSlot === 'Lunch' ? '점심' : '저녁'}
                  <Dot size={20} className={statusDotColor} />
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-black">
                  <div className="flex items-center gap-1.5">
                    <User size={16} />
                    <span className="font-bold">{host?.name} ({host?.studentId}학번)</span>
                    {/* Host Role Badge */}
                    <span className="text-xs bg-black text-white px-1.5 py-0.5 ml-1">
                      {host?.role === 'Senior' ? '선배' : '후배'}
                    </span>
                  </div>

                  {host?.instaId && (
                    <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-0.5">
                      <Instagram size={14} className="text-black" />
                      <span className="font-medium">@{host.instaId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Counts Display */}
              <div className={`flex flex-col gap-1`}>
                {/* Senior Count */}
                <div className={`flex items-center space-x-2 px-3 py-1 border-[1.5px] border-black transition-colors ${isSeniorFull ? 'bg-gray-100 text-gray-500' : 'bg-white text-black'}`}>
                  <span className="text-xs font-bold w-6">선배</span>
                  <span className="text-sm font-black">
                    {seniorCount} <span className="text-gray-400">/</span> {maxSenior}
                  </span>
                </div>
                {/* Junior Count */}
                <div className={`flex items-center space-x-2 px-3 py-1 border-[1.5px] border-black transition-colors ${isJuniorFull ? 'bg-gray-100 text-gray-500' : 'bg-white text-black'}`}>
                  <span className="text-xs font-bold w-6">후배</span>
                  <span className="text-sm font-black">
                    {juniorCount} <span className="text-gray-400">/</span> {maxJunior}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-black mb-6 bg-white p-5 rounded-none leading-relaxed border-[1.5px] border-black">
              {app.intro}
            </p>

            <button
              onClick={() => onJoinClick(app.id)}
              disabled={isAbsolutelyFull}
              className="w-full text-white py-5 rounded-none font-bold text-lg active:scale-[0.98] transition-all shadow-none disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed bg-black hover:bg-white hover:text-black border-[1.5px] border-black"
            >
              {isAbsolutelyFull ? '정원 마감' : '참여하기'}
            </button>
          </div>
        );
      })}
    </div>
  );
}