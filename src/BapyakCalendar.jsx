import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Sun, Moon, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import JoinModal from './JoinModal';
import BapyakDetailModal from './BapyakDetailModal';

export default function BapyakCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState(null);

  const [detailModalApp, setDetailModalApp] = useState(null);
  const [joinModalApp, setJoinModalApp] = useState(null);
  
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'appointments'), 
      (snapshot) => {
        const appointmentsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date() 
          };
        });
        setAppointments(appointmentsData);
        setError(null);
      },
      (err) => {
        console.error("Firebase read error:", err);
        setError("Failed to load appointments. Check your connection and Firestore rules.");
      }
    );
    return () => unsubscribe();
  }, []);

  const handleJoin = async (joinerInfo) => {
    if (!joinModalApp) return;
    setIsJoining(true);
    const appointmentRef = doc(db, 'appointments', joinModalApp.id);
    try {
      await updateDoc(appointmentRef, {
        currentCount: increment(1),
        participants: arrayUnion(joinerInfo)
      });
    } catch (error) {
      console.error("Failed to join:", error);
    } finally {
      setIsJoining(false);
      setJoinModalApp(null);
    }
  };

  const week = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(currentDate, { weekStartsOn: 1 })
  });

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      {detailModalApp && (
        <BapyakDetailModal
          appointment={detailModalApp}
          onClose={() => setDetailModalApp(null)}
          onJoinClick={() => setJoinModalApp(detailModalApp)}
        />
      )}
      {joinModalApp && (
        <JoinModal
          isJoining={isJoining}
          onJoin={handleJoin}
          onCancel={() => setJoinModalApp(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentDate(subDays(currentDate, 7))} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Today
            </button>
            <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg col-span-full mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {week.map(day => (
            <div key={day.toString()} className="bg-white rounded-3xl p-3 sm:p-4">
              <p className="text-center font-bold text-sm sm:text-base">{format(day, 'EEE')}</p>
              <p className="text-center text-xs sm:text-sm text-gray-500 mb-4">{format(day, 'd')}</p>
              <div className="space-y-4">
                {appointments.filter(app => isSameDay(app.createdAt, day)).map(app => {
                  const isFull = (app.currentCount || 0) >= app.maxCount;
                  return (
                    <div key={app.id} onClick={() => setDetailModalApp(app)} className={`p-4 rounded-2xl cursor-pointer transform hover:scale-105 transition-transform duration-300 ${isFull ? 'bg-gray-100 border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {app.mealType === 'lunch' ? <Sun className={`h-5 w-5 ${isFull ? 'text-gray-400' : 'text-yellow-500'}`} /> : <Moon className={`h-5 w-5 ${isFull ? 'text-gray-400' : 'text-indigo-500'}`} />}
                        <p className={`font-bold text-sm ${isFull ? 'text-gray-600' : 'text-blue-800'}`}>{app.name}'s Bapyak</p>
                      </div>
                      <p className={`text-xs break-words ${isFull ? 'text-gray-500' : 'text-blue-700'}`}>{app.intro}</p>
                      <div className="mt-3">
                          <div className={`w-full rounded-full h-2 ${isFull ? 'bg-gray-300' : 'bg-blue-200'}`}>
                              <div className={`${isFull ? 'bg-gray-500' : 'bg-blue-500'} h-2 rounded-full`} style={{ width: `${((app.currentCount || 0) / app.maxCount) * 100}%` }}></div>
                          </div>
                          <p className={`text-xs text-right mt-1 ${isFull ? 'text-gray-500' : 'text-blue-600'}`}>{app.currentCount || 0}/{app.maxCount}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {appointments.length === 0 && !error && (
             <div className="text-center py-12 col-span-full">
                <Info className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No available bapyaks</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later or create a new one!</p>
            </div>
        )}
      </div>
    </div>
  );
}
