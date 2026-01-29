import React, { useState, useEffect } from 'react';
import {
  User, Lock, AlignLeft, Users, Calendar, Sun, Moon, Instagram, CheckCircle, X,
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

  // 공통 스타일: 그리드 레이아웃 적용 및 높이 고정
  const gridContainerStyle = "grid grid-cols-[60px_1fr] items-center border-[2px] border-black bg-white";
  const iconContainerStyle = "flex items-center justify-center h-full border-r-[2px] border-black bg-gray-50";
  const inputStyle = "w-full h-16 px-6 bg-white outline-none text-xl !text-left focus:ring-4 focus:ring-black/5 placeholder:text-gray-400";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fffbf0] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-[2px] border-black overflow-y-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:bg-black hover:text-white border-[2px] border-black transition-colors p-2 z-20"
        >
          <X size={32} />
        </button>

        <h2 className="text-4xl font-black mb-12 text-center text-black uppercase tracking-tighter">
          새 밥약
        </h2>
        
        <div className="space-y-6">
          {/* 1행: 이름 & 학번 (2단 레이아웃) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={gridContainerStyle}>
              <div className={iconContainerStyle}><User size={28} /></div>
              <input id="name" onChange={handleChange} value={formData.name} className={inputStyle} placeholder="이름" />
            </div>
            <div className={gridContainerStyle.replace('grid-cols-[60px_1fr]', 'grid-cols-1')}>
              <input id="studentId" onChange={handleChange} value={formData.studentId} className={`${inputStyle} !text-center font-bold`} placeholder="학번" />
            </div>
          </div>

          {/* 2행: 인스타 아이디 */}
          <div className={gridContainerStyle}>
            <div className={iconContainerStyle}><Instagram size={28} /></div>
            <input id="instagramId" onChange={handleChange} value={formData.instagramId} className={inputStyle} placeholder="인스타그램 ID" />
          </div>

          {/* 3행: 날짜 선택 */}
          <div className={gridContainerStyle}>
            <div className={iconContainerStyle}><Calendar size={28} /></div>
            <input type="date" value={formData.date} onChange={(e) => handleDirectChange('date', e.target.value)} className={`${inputStyle} cursor-pointer`} />
          </div>

          {/* 4행: 시간 선택 (점심/저녁) */}
          <div className="flex gap-6">
            <button
              onClick={() => handleDirectChange('timeSlot', 'Lunch')}
              className={`flex-1 py-8 rounded-none flex items-center justify-center gap-3 font-black text-xl border-[2px] border-black transition-all ${
                formData.timeSlot === 'Lunch' 
                  ? 'bg-white text-black hover:bg-gray-50 shadow-none'
                  : 'bg-black text-white translate-x-[-4px] translate-y-[-4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
              }`}
            >
              <Sun size={32} /> 점심
            </button>
            <button
              onClick={() => handleDirectChange('timeSlot', 'Dinner')}
              className={`flex-1 py-8 rounded-none flex items-center justify-center gap-3 font-black text-xl border-[2px] border-black transition-all ${
                formData.timeSlot === 'Dinner' 
                  ?  'bg-white text-black hover:bg-gray-50 shadow-none'
                  : 'bg-black text-white translate-x-[-4px] translate-y-[-4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
              }`}
            >
              <Moon size={32} /> 저녁
            </button>
          </div>

          {/* 5행: 자기소개 (높은 Textarea) */}
          <div className={`${gridContainerStyle} items-start`}>
            <div className={`${iconContainerStyle} h-32 pt-4`}><AlignLeft size={28} /></div>
            <textarea
              id="intro"
              onChange={handleChange}
              value={formData.intro}
              className={`${inputStyle} h-32 py-4 resize-none !text-left leading-relaxed`}
              placeholder="메뉴나 장소, 하고 싶은 말을 적어주세요!"
            />
          </div>

          {/* 6행: 인원수 & PIN (2단 레이아웃) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={gridContainerStyle}>
              <div className={iconContainerStyle}><Users size={28} /></div>
              <select onChange={(e) => handleDirectChange('maxCount', Number(e.target.value))} className={`${inputStyle} appearance-none font-bold cursor-pointer text-center`}>
                <option value="2">2명</option>
                <option value="4">4명</option>
                <option value="6">6명</option>
                <option value="8">8명</option>
              </select>
            </div>
            <div className={gridContainerStyle}>
              <div className={iconContainerStyle}><Lock size={28} /></div>
              <input type="password" id="pin" onChange={handleChange} value={formData.pin} className={`${inputStyle} !text-center font-bold tracking-widest`} placeholder="PIN 4자리" maxLength={4} />
            </div>
          </div>

          {/* 생성 버튼 */}
          <button
            onClick={handleCreateClick}
            className="w-full bg-[#eee] text-black font-black h-20 rounded-none text-3xl mt-8 border-[2px] border-black hover:bg-black hover:text-white transition-all active:translate-x-0 active:translate-y-0 active:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-4"
          >
            <CheckCircle size={36} /> 생성 완료!
          </button>
        </div>
      </div>
    </div>
  );
}