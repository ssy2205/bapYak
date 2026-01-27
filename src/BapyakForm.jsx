import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User, BookUser, Instagram, KeyRound, Users, Hash, Sun, Moon } from 'lucide-react';

export default function BapyakForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    instagramId: '',
    intro: '',
    mealType: 'lunch', // Default to lunch
    maxCount: 2,
    pin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMealTypeChange = (type) => {
    setFormData(prev => ({ ...prev, mealType: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pin.length !== 4) {
      setError('PIN must be 4 digits.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        maxCount: Number(formData.maxCount),
        currentCount: 1,
        createdAt: new Date(),
        participants: [{name: formData.name, studentId: formData.studentId, instagramId: formData.instagramId}]
      });
      // Reset form and call the success callback
      setFormData({
        name: '', studentId: '', instagramId: '', intro: '', mealType: 'lunch', maxCount: 2, pin: ''
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to create appointment. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md">
        <div className="bg-blue-500 rounded-t-3xl p-8">
          <h1 className="text-3xl font-bold text-white text-center">New Bapyak</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <div className="space-y-5">
            {/* Meal Type Selection */}
            <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-full">
              <button type="button" onClick={() => handleMealTypeChange('lunch')} className={`flex-1 py-2 px-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${formData.mealType === 'lunch' ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}>
                <Sun className="h-5 w-5" /> Lunch
              </button>
              <button type="button" onClick={() => handleMealTypeChange('dinner')} className={`flex-1 py-2 px-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${formData.mealType === 'dinner' ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}>
                <Moon className="h-5 w-5" /> Dinner
              </button>
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4" />
            </div>
            <div className="relative">
              <BookUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} required className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4" />
            </div>
            <div className="relative">
              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" id="instagramId" placeholder="Instagram ID" value={formData.instagramId} onChange={handleChange} className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4" />
            </div>
            <div className="relative">
               <Hash className="absolute left-4 top-7 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <textarea id="intro" placeholder="A unique intro for your post" rows="3" value={formData.intro} onChange={handleChange} required className="pl-12 w-full border-gray-300 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4"></textarea>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="relative flex-1">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="number" id="maxCount" placeholder="Max Participants" value={formData.maxCount} onChange={handleChange} required min="2" className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4" />
              </div>
              <div className="relative flex-1">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="password" id="pin" placeholder="4-digit PIN" value={formData.pin} onChange={handleChange} required maxLength="4" pattern="\d{4}" className="pl-12 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-4" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:bg-blue-300">
            {isSubmitting ? 'Creating...' : 'Create Bapyak'}
          </button>
        </form>
      </div>
    </div>
  );
}
