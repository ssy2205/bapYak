import React, { useState } from 'react';
import { User, X, Instagram, CheckCircle } from 'lucide-react';

export default function JoinModal({ isOpen, onClose, onJoinSubmit }) {
  const [joinData, setJoinData] = useState({
    name: '',
    studentId: '',
    instaId: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!joinData.name || !joinData.studentId || !joinData.instaId) {
      alert('모든 정보를 입력해주세요!');
      return;
    }
    onJoinSubmit(joinData);
  };

  // 공통 스타일: 그리드 레이아웃 및 높이 고정
  const gridContainerStyle = "grid grid-cols-[70px_1fr] items-center border-[2px] border-black bg-white transition-all focus-within:ring-4 focus-within:ring-black/5";
  const iconContainerStyle = "flex items-center justify-center h-full border-r-[2px] border-black bg-gray-50";
  const inputStyle = "w-full h-20 px-6 bg-white outline-none text-xl font-bold !text-left placeholder:text-gray-400";

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fffbf0] p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-[2px] border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={(e) => {
            onClose();
          }}
          className="absolute top-6 right-6 text-black hover:bg-black hover:text-white border-[2.5px] border-black transition-colors p-2 z-[2010] cursor-pointer bg-white" 
        >
          <X size={32} />
        </button>

        <h3 className="text-3xl font-black text-center mb-10 text-black uppercase tracking-tighter">
          밥약 참여하기
        </h3>

        <div className="space-y-6">
          {/* 이름 입력 */}
          <div className={gridContainerStyle}>
            <div className={iconContainerStyle}><User size={28} /></div>
            <input
              className={inputStyle}
              placeholder="이름"
              value={joinData.name}
              onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
            />
          </div>

          {/* 학번 입력 */}
          <div className={gridContainerStyle}>
            <div className={`${iconContainerStyle} text-xl font-black`}>ID</div>
            <input
              className={inputStyle}
              placeholder="학번 (예: 25)"
              value={joinData.studentId}
              onChange={(e) => setJoinData({ ...joinData, studentId: e.target.value })}
            />
          </div>

          {/* 인스타 아이디 입력 */}
          <div className={gridContainerStyle}>
            <div className={iconContainerStyle}><Instagram size={28} /></div>
            <input
              className={inputStyle}
              placeholder="인스타그램 ID"
              value={joinData.instaId}
              onChange={(e) => setJoinData({ ...joinData, instaId: e.target.value })}
            />
          </div>

          {/* 참여 완료 버튼 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white font-black h-20 rounded-none text-2xl mt-8 border-[2px] border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-3"
          >
            <CheckCircle size={32} /> 나도 참여할래!
          </button>
        </div>
      </div>
    </div>
  );
}