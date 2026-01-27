import { User, Users, X, Sun, Moon, Instagram } from 'lucide-react';

export default function BapyakDetailModal({ appointment, onClose, onJoinClick }) {
  if (!appointment) return null;

  const isFull = (appointment.currentCount || 0) >= appointment.maxCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {appointment.mealType === 'lunch' ? <Sun className="text-yellow-500" /> : <Moon className="text-indigo-500" />}
            {appointment.name}'s Bapyak
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <p className="text-gray-700 text-lg">{appointment.intro}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({appointment.currentCount || 0}/{appointment.maxCount})
            </h3>
            <div className="space-y-3">
              {appointment.participants && appointment.participants.map((participant, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.studentId}</p>
                    </div>
                  </div>
                  {participant.instagramId && (
                    <a href={`https://instagram.com/${participant.instagramId}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                      <Instagram className="h-5 w-5 text-pink-500" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 mt-auto">
          {!isFull ? (
            <button
              onClick={() => {
                onClose(); // Close this modal first
                onJoinClick(); // Then open the join modal
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Join Bapyak
            </button>
          ) : (
            <div className="text-center font-medium text-gray-600 bg-gray-100 py-3 rounded-full">
              This bapyak is full.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
