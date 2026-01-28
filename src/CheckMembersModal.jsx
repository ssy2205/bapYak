import React from 'react';
import { X, User, Instagram } from 'lucide-react';

export default function CheckMembersModal({ isOpen, onClose, participants, app }) {
  if (!isOpen || !participants) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-none bg-white p-8 shadow-none border-[1.5px] border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:bg-black hover:text-white border-[1.5px] border-black rounded-none p-1"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-black">참여 멤버 확인</h3>
        <p className="text-center text-black mb-4">
          {app?.timeSlot === 'Lunch' ? '점심' : '저녁'} 밥약 ({app?.date})
        </p>

        <div className="space-y-3">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border-[1.5px] border-black p-3 rounded-none shadow-none"
            >
              <div className="w-8 h-8 rounded-none bg-black flex items-center justify-center text-white font-bold text-xs border-[1.5px] border-black">
                {p.name[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-black">
                  {p.name}{' '}
                  <span className="text-xs font-normal text-black">
                    ({p.studentId})
                  </span>
                  {p.isHost && (
                    <span className="ml-1 text-[10px] bg-black text-white px-1.5 py-0.5 rounded-none">
                      HOST
                    </span>
                  )}
                </span>
                {!p.isHost && p.instaId && (
                  <span className="text-xs text-black flex items-center gap-1">
                    <Instagram size={10} className="text-black" /> {p.instaId}
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