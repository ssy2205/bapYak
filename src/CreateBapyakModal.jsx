import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  AlignLeft,
  Users,
  Calendar,
  Sun,
  Moon,
  Instagram,
  CheckCircle,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

export default function CreateBapyakModal({ isOpen, onClose, onCreate, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    studentId: initialData.studentId,
    instagramId: initialData.instagramId,
    intro: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: 'Lunch',
    maxCount: 2,
    pin: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: initialData.name,
      studentId: initialData.studentId,
      instagramId: initialData.instagramId,
    }));
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDirectChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateClick = () => {
    if (!formData.name || !formData.intro || !formData.pin) {
      alert('필수 항목을 모두 입력해주세요!');
      return;
    }
    onCreate(formData);
    setFormData(prev => ({...prev, intro: '', pin: ''}));
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
        className="relative w-full max-w-lg rounded-none bg-white p-8 shadow-none border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-8 text-center text-gray-800">새로운 밥약 등록</h2>
        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-[2]">
              <User className="absolute left-5 top-5 text-gray-600" size={24} />
              <input
                id="name"
                onChange={handleChange}
                value={formData.name}
                className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
                placeholder="이름"
              />
            </div>
            <input
              id="studentId"
              onChange={handleChange}
              value={formData.studentId}
              className="flex-1 px-2 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg text-center focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="학번"
            />
          </div>

          <div className="relative">
            <Instagram className="absolute left-5 top-5 text-gray-600" size={24} />
            <input
              id="instagramId"
              onChange={handleChange}
              value={formData.instagramId}
              className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="인스타 아이디 (선택)"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-5 top-5 text-gray-600" size={24} />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDirectChange('date', e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg text-gray-800"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleDirectChange('timeSlot', 'Lunch')}
              className={`flex-1 py-5 rounded-none flex items-center justify-center gap-2 font-bold text-lg border-2 transition-all ${
                formData.timeSlot === 'Lunch'
                  ? 'bg-black text-white border-black shadow-none'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sun size={24} /> 점심
            </button>
            <button
              onClick={() => handleDirectChange('timeSlot', 'Dinner')}
              className={`flex-1 py-5 rounded-none flex items-center justify-center gap-2 font-bold text-lg border-2 transition-all ${
                formData.timeSlot === 'Dinner'
                  ? 'bg-black text-white border-black shadow-none'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Moon size={24} /> 저녁
            </button>
          </div>

          <div className="relative">
            <AlignLeft className="absolute left-5 top-5 text-gray-600" size={24} />
            <textarea
              id="intro"
              onChange={handleChange}
              value={formData.intro}
              className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg h-40 resize-none focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="메뉴나 장소, 하고 싶은 말을 적어주세요!"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Users className="absolute left-5 top-5 text-gray-600" size={24} />
              <select
                onChange={(e) => handleDirectChange('maxCount', Number(e.target.value))}
                className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg appearance-none text-gray-800"
              >
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="6">6명</option>
              </select>
            </div>
            <div className="relative flex-1">
              <Lock className="absolute left-5 top-5 text-gray-600" size={24} />
              <input
                type="password"
                id="pin"
                onChange={handleChange}
                value={formData.pin}
                className="w-full pl-16 pr-4 py-5 bg-white rounded-none border border-gray-300 outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
                placeholder="PIN 4자리"
              />
            </div>
          </div>

          <button
            onClick={handleCreateClick}
            className="w-full bg-black text-white font-black py-6 rounded-none text-xl shadow-none active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2"
          >
            <CheckCircle size={28} /> 생성 완료!
          </button>
        </div>
      </div>
    </div>
  );
}
