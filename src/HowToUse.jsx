import React from 'react';
import { Calendar, UserPlus, CheckCircle, Shield } from 'lucide-react';

export default function HowToUse() {
  const steps = [
    {
      icon: <Calendar size={48} className="mb-4" />,
      title: "1. 날짜 선택",
      description: "캘린더에서 원하는 날짜를 선택하세요. 이미 밥약이 있다면 목록이 표시됩니다."
    },
    {
      icon: <UserPlus size={48} className="mb-4" />,
      title: "2. 밥약 생성 또는 참여",
      description: "우측 하단의 + 버튼으로 새로운 밥약을 만들거나, 기존 밥약에 참여하세요."
    },
    {
      icon: <Shield size={48} className="mb-4" />,
      title: "3. PIN 인증 및 관리",
      description: "밥약을 숨기거나 참여 멤버를 확인할 때 PIN 번호가 필요합니다. 생성 시 PIN을 꼭 기억하세요!"
    },
    {
      icon: <CheckCircle size={48} className="mb-4" />,
      title: "4. 즐거운 식사",
      description: "약속된 시간에 만나 즐겁게 식사하세요! 🍚"
    }
  ];

  return (
    <div className="w-full bg-[#fffbf0] text-black border-t-[3px] border-black py-16 px-4 lg:col-span-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12 uppercase tracking-tighter">
          밥약 사용법
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white border-[1.5px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="bg-black text-white p-3 rounded-full mb-4">
                {React.cloneElement(step.icon, { size: 32 })}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-700 leading-relaxed word-keep break-keep">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg font-bold border-b-2 border-black inline-block pb-1">
            지금 바로 밥약을 만들어보세요!
          </p>
        </div>
      </div>
    </div>
  );
}
