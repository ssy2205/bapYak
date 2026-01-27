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
    // Reset form and close modal is handled by parent component
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6">참여 정보 입력 📝</h3>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-4 text-gray-400" size={20} />
            <input
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="이름"
              value={joinData.name}
              onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <span className="absolute left-5 top-4 text-gray-400 font-bold text-sm">
              ID
            </span>
            <input
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="학번 (예: 24)"
              value={joinData.studentId}
              onChange={(e) =>
                setJoinData({ ...joinData, studentId: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <Instagram
              className="absolute left-5 top-4 text-gray-400"
              size={20}
            />
            <input
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="인스타 아이디"
              value={joinData.instaId}
              onChange={(e) =>
                setJoinData({ ...joinData, instaId: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-orange-200 active:scale-95 transition-all"
          >
            입력 완료!
          </button>
        </div>
      </div>
    </div>
  );
}