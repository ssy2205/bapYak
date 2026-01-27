import React from 'react';
import { X, User, Instagram } from 'lucide-react';

export default function CheckMembersModal({ isOpen, onClose, participants, app }) {
  if (!isOpen || !participants) return null;

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

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">참여 멤버 확인 👥</h3>
        <p className="text-center text-gray-600 mb-4">
          {app?.timeSlot === 'Lunch' ? '점심' : '저녁'} 밥약 ({app?.date})
        </p>

        <div className="space-y-3">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-2xl shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">
                {p.name[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">
                  {p.name}{' '}
                  <span className="text-xs font-normal text-gray-400">
                    ({p.studentId})
                  </span>
                  {p.isHost && (
                    <span className="ml-1 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                      HOST
                    </span>
                  )}
                </span>
                {!p.isHost && p.instaId && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Instagram size={10} /> {p.instaId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
