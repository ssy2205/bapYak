import { useState } from 'react';
import { User, BookUser, Instagram } from 'lucide-react';

export default function JoinModal({ onJoin, onCancel, isJoining }) {
  const [joinerInfo, setJoinerInfo] = useState({ name: '', studentId: '', instagramId: '' });

  const handleChange = (e) => {
    setJoinerInfo({ ...joinerInfo, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(joinerInfo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Join Bapyak</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="name" placeholder="Your Name" required onChange={handleChange} className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" />
            </div>
            <div className="relative">
              <BookUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="studentId" placeholder="Your Student ID" required onChange={handleChange} className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" />
            </div>
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="instagramId" placeholder="Your Instagram ID" onChange={handleChange} className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-full transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isJoining} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:bg-blue-300">
                {isJoining ? 'Joining...' : 'Confirm Join'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
