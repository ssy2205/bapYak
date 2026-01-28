import React, { useState } from 'react';
import { User, X, Instagram } from 'lucide-react';

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-none bg-white p-8 shadow-none border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-800 border-2 border-black rounded-none p-1"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-black">참여 정보 입력</h3>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-6 text-black" size={24} />
            <input
              className="w-full pl-16 pr-4 py-6 bg-white rounded-none border-2 border-black outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="이름"
              value={joinData.name}
              onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <span className="absolute left-5 top-6 text-black font-bold text-lg">
              ID
            </span>
            <input
              className="w-full pl-16 pr-4 py-6 bg-white rounded-none border-2 border-black outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="학번 (예: 24)"
              value={joinData.studentId}
              onChange={(e) =>
                setJoinData({ ...joinData, studentId: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <Instagram
              className="absolute left-5 top-6 text-black"
              size={24}
            />
            <input
              className="w-full pl-16 pr-4 py-6 bg-white rounded-none border-2 border-black outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="인스타 아이디"
              value={joinData.instaId}
              onChange={(e) =>
                setJoinData({ ...joinData, instaId: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white font-bold py-5 rounded-none mt-4 shadow-none hover:bg-gray-800 active:scale-95 transition-all border-2 border-black"
          >
            입력 완료!
          </button>
        </div>
      </div>
    </div>
  );
}
