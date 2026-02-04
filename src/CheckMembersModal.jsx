import React from 'react';
import { X, User, Instagram } from 'lucide-react';

export default function CheckMembersModal({ isOpen, onClose, participants, app }) {
  if (!isOpen || !participants) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-none bg-[#fffbf0] shadow-none border-[1.5px] border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section (Fixed) */}
        <div className="p-6 pb-2 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:bg-black hover:text-white border-[1.5px] border-black rounded-none p-1 z-50 bg-white"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-bold text-center text-black mb-1">참여 멤버 확인</h3>
          <p className="text-center text-black text-sm">
            {app?.timeSlot === 'Lunch' ? '점심' : '저녁'} 밥약 ({app?.date})
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 pt-4 space-y-3">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border-[1.5px] border-black p-3 rounded-none shadow-none"
            >
              <div className="w-10 h-10 shrink-0 rounded-none bg-black flex items-center justify-center text-white font-bold text-sm border-[1.5px] border-black">
                {p.name[0]}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base font-bold text-black truncate">
                    {p.name}
                  </span>
                  <span className="text-xs font-normal text-gray-700">
                    ({p.studentId})
                  </span>
                  {p.isHost && (
                    <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-none shrink-0">
                      HOST
                    </span>
                  )}
                </div>
                {!p.isHost && p.instaId && (
                  <div className="text-sm text-black flex items-center gap-1.5 mt-0.5 truncate">
                    <Instagram size={12} className="text-black shrink-0" />
                    <span className="truncate">{p.instaId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}