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
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-none bg-white p-8 shadow-none border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">참여 정보 입력</h3>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-5 text-gray-600" size={24} />
            <input
              className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="이름"
              value={joinData.name}
              onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <span className="absolute left-5 top-5 text-gray-600 font-bold text-lg">
              ID
            </span>
            <input
              className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="학번 (예: 24)"
              value={joinData.studentId}
              onChange={(e) =>
                setJoinData({ ...joinData, studentId: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <Instagram
              className="absolute left-5 top-5 text-gray-600"
              size={24}
            />
            <input
              className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="인스타 아이디"
              value={joinData.instaId}
              onChange={(e) =>
                setJoinData({ ...joinData, instaId: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white font-bold py-5 rounded-none mt-4 shadow-none hover:bg-gray-800 active:scale-95 transition-all"
          >
            입력 완료!
          </button>
        </div>
      </div>
    </div>
  );
}