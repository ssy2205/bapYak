import React, { useState } from 'react';
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
} from 'lucide-react';

export default function BapyakForm({ onCreate, initialData, onFormChange }) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    studentId: initialData.studentId,
    instagramId: initialData.instagramId,
    intro: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Lunch',
    maxCount: 2,
    pin: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newFormData = { ...formData, [id]: value };
    setFormData(newFormData);
    if (['name', 'studentId', 'instagramId'].includes(id)) {
      onFormChange({ [id]: value });
    }
  };
  
  const handleDirectChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
     if (['name', 'studentId', 'instagramId'].includes(key)) {
      onFormChange({ [key]: value });
    }
  };


  const handleCreateClick = () => {
    if (!formData.name || !formData.intro || !formData.pin) {
      alert('필수 항목을 모두 입력해주세요!');
      return;
    }
    onCreate(formData);
    // Reset only intro and pin after creation
    setFormData(prev => ({...prev, intro: '', pin: ''}));
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-orange-100 animate-fade-in">
      <h2 className="text-2xl font-black mb-8 text-center text-orange-600">새로운 밥약 등록 🍚</h2>
      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-[2]">
            <User className="absolute left-5 top-5 text-orange-400" size={24} />
            <input
              id="name"
              onChange={handleChange}
              value={formData.name}
              className="w-full pl-16 pr-4 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg focus:ring-2 focus:ring-orange-400 transition-all placeholder:text-gray-400"
              placeholder="이름"
            />
          </div>
          <input
            id="studentId"
            onChange={handleChange}
            value={formData.studentId}
            className="flex-1 px-2 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg text-center focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
            placeholder="학번"
          />
        </div>

        <div className="relative">
          <Instagram className="absolute left-5 top-5 text-orange-400" size={24} />
          <input
            id="instagramId"
            onChange={handleChange}
            value={formData.instagramId}
            className="w-full pl-16 pr-4 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg focus:ring-2 focus:ring-orange-400 transition-all placeholder:text-gray-400"
            placeholder="인스타 아이디 (선택)"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-5 top-5 text-orange-400" size={24} />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleDirectChange('date', e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg text-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleDirectChange('timeSlot', 'Lunch')}
            className={`flex-1 py-5 rounded-3xl flex items-center justify-center gap-2 font-bold text-lg border-2 transition-all ${
              formData.timeSlot === 'Lunch'
                ? 'bg-orange-100 border-orange-500 text-orange-700 shadow-sm'
                : 'bg-gray-50 border-transparent text-gray-400'
            }`}
          >
            <Sun size={24} /> 점심
          </button>
          <button
            onClick={() => handleDirectChange('timeSlot', 'Dinner')}
            className={`flex-1 py-5 rounded-3xl flex items-center justify-center gap-2 font-bold text-lg border-2 transition-all ${
              formData.timeSlot === 'Dinner'
                ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm'
                : 'bg-gray-50 border-transparent text-gray-400'
            }`}
          >
            <Moon size={24} /> 저녁
          </button>
        </div>

        <div className="relative">
          <AlignLeft className="absolute left-5 top-5 text-orange-400" size={24} />
          <textarea
            id="intro"
            onChange={handleChange}
            value={formData.intro}
            className="w-full pl-16 pr-4 py-5 bg-orange-50/50 rounded-[2rem] outline-none text-lg h-40 resize-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
            placeholder="메뉴나 장소, 하고 싶은 말을 적어주세요!"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Users className="absolute left-5 top-5 text-orange-400" size={24} />
            <select
              onChange={(e) => handleDirectChange('maxCount', Number(e.target.value))}
              className="w-full pl-16 pr-4 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg appearance-none text-gray-700"
            >
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="6">6명</option>
            </select>
          </div>
          <div className="relative flex-1">
            <Lock className="absolute left-5 top-5 text-orange-400" size={24} />
            <input
              type="password"
              id="pin"
              onChange={handleChange}
              value={formData.pin}
              className="w-full pl-16 pr-4 py-5 bg-orange-50/50 rounded-3xl outline-none text-lg focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
              placeholder="PIN 4자리"
            />
          </div>
        </div>

        <button
          onClick={handleCreateClick}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-6 rounded-[2rem] text-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2"
        >
          <CheckCircle size={28} /> 생성 완료!
        </button>
      </div>
    </div>
  );
}
