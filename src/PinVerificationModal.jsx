import React from 'react';
import { Lock, X } from 'lucide-react'; // EyeOff will be passed as an icon prop

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
  confirmButtonIcon: ConfirmButtonIcon, // Renamed to be used as a component
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">{title}</h3>
        <p className="text-center text-gray-600 mb-4">{description}</p>
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
            onClick={onVerify}
            className="w-full bg-gray-800 text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {ConfirmButtonIcon && <ConfirmButtonIcon size={20} />} {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
