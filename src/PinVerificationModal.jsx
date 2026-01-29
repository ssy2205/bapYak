import React, { useEffect } from 'react'; // ★ useEffect 추가
import { Lock, X } from 'lucide-react';

export default function PinVerificationModal({
  isOpen,
  onClose,
  onVerify,
  pin,
  setPin,
  error,
  title,
  description,
  confirmButtonText,
  confirmButtonIcon: ConfirmButtonIcon,
}) {
  
  // ★ 자동 확인 로직: pin이 4자가 되면 자동으로 onVerify 실행
  useEffect(() => {
    if (pin.length === 4) {
      onVerify();
    }
  }, [pin, onVerify]); // pin 값이 바뀔 때마다 체크합니다.

  if (!isOpen) return null;

  const gridContainerStyle = "grid grid-cols-[70px_1fr] items-center border-[2.5px] border-black bg-white focus-within:ring-4 focus-within:ring-black/5 transition-all";
  const iconContainerStyle = "flex items-center justify-center h-20 border-r-[2.5px] border-black bg-gray-50";
  const inputStyle = "w-full h-20 px-6 bg-white outline-none text-2xl font-black !text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-400";

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fffbf0] p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-[2.5px] border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="absolute top-6 right-6 text-black hover:bg-black hover:text-white border-[2.5px] border-black transition-colors p-2 z-[2010] cursor-pointer bg-white"
        >
          <X size={28} />
        </button>

        <h3 className="text-3xl font-black text-center mb-4 text-black uppercase tracking-tighter">
          {title}
        </h3>
        <p className="text-center text-gray-700 mb-10 font-medium px-2">
          {description}
        </p>

        <div className="space-y-6">
          <div className={gridContainerStyle}>
            <div className={iconContainerStyle}>
              <Lock size={32} />
            </div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              className={inputStyle}
              placeholder="PIN 4자리"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 font-bold text-center animate-pulse">
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={onVerify}
            className="w-full bg-black text-white font-black h-20 rounded-none mt-4 border-[2.5px] border-black hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 text-2xl"
          >
            {ConfirmButtonIcon && <ConfirmButtonIcon size={32} />} 
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}