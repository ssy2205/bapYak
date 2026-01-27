import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { Utensils, MapPin, User, Users, Info } from 'lucide-react';

export default function BapyakDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const appointmentsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(appointment => (appointment.currentCount || 0) < appointment.maxCount);
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleJoin = async (id) => {
    const appointmentRef = doc(db, 'appointments', id);
    await updateDoc(appointmentRef, {
      currentCount: increment(1)
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Bapyaks</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map(app => (
            <div key={app.id} className="bg-white shadow-sm rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="font-semibold text-gray-800">{app.name} ({app.studentId})</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 break-words">{app.intro}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{app.menu}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{app.place}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{app.currentCount || 0} / {app.maxCount} filled</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((app.currentCount || 0) / app.maxCount) * 100}%` }}></div>
                </div>
                <button
                  onClick={() => handleJoin(app.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
        {appointments.length === 0 && (
          <div className="text-center py-12">
             <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No available bapyaks</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later or create a new one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
