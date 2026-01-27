import React from 'react';
import { Lock, X, EyeOff } from 'lucide-react';

export default function HideModal({
  isOpen,
  onClose,
  onConfirm,
  pin,
  setPin,
  error,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">밥약 숨기기 🙈</h3>
        <p className="text-center text-gray-600 mb-4">이 밥약을 목록에서 숨깁니다.<br/>PIN 번호를 입력하여 확인해주세요.</p>
        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-5 top-4 text-gray-400" size={20} />
            <input
              type="password"
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="PIN 4자리"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={onConfirm}
            className="w-full bg-gray-800 text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <EyeOff size={20} /> 숨기기 확인
          </button>
        </div>
      </div>
    </div>
  );
}
