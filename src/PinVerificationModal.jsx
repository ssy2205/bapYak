import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-none bg-[#fffbf0] p-8 shadow-none border-[1.5px] border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:bg-black hover:text-white border-[1.5px] border-black rounded-none p-1"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-black">{title}</h3>
        <p className="text-center text-black mb-4">{description}</p>
        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-5 top-6 text-black" size={24} />
            <input
              type="password"
              className="w-full pl-16 pr-4 py-6 bg-white rounded-none border-[1.5px] border-black outline-none text-lg focus:ring-2 focus:ring-black placeholder:text-gray-500"
              placeholder="PIN 4자리"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={onVerify}
            className="w-full bg-black text-white font-bold py-5 rounded-none mt-4 shadow-none hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-2 border-[1.5px] border-black"
          >
            {ConfirmButtonIcon && <ConfirmButtonIcon size={20} />} {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}