import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import BapyakForm from './BapyakForm';
import BapyakList from './BapyakList';
import JoinModal from './JoinModal';
import HideModal from './HideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [appointments, setAppointments] = useState([]);

  // State for user info that persists across creations
  const [hostInfo, setHostInfo] = useState({
    name: '',
    studentId: '',
    instagramId: '',
  });

  // Join Modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  // Hide Modal state
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [selectedAppToHide, setSelectedAppToHide] = useState(null);
  const [hidePin, setHidePin] = useState('');
  const [hideError, setHideError] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  // Real-time data sync
  useEffect(() => {
    const q = query(collection(db, 'appointments'), where("isHidden", "==", false), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, []);

  // --- Event Handlers ---

  const handleFormChange = (newHostInfo) => {
    setHostInfo(prev => ({...prev, ...newHostInfo}));
  };

  const handleCreate = async (formData) => {
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        isHidden: false, // Add isHidden field on creation
        participants: [
          {
            name: formData.name,
            studentId: formData.studentId,
            instaId: formData.instagramId,
            isHost: true,
          },
        ],
        createdAt: serverTimestamp(),
      });

      alert('밥약 생성 완료! 🎉');
      setActiveTab('list');
    } catch (e) {
      console.error(e);
      alert('에러가 발생했습니다.');
    }
  };

  const handleJoinSubmit = async (joinData) => {
    try {
      const docRef = doc(db, 'appointments', selectedAppId);
      await updateDoc(docRef, {
        participants: arrayUnion({
          ...joinData,
          isHost: false,
        }),
      });

      setJoinModalOpen(false);
      alert('참여 완료! 밥약에서 만나요 👋');
    } catch (e) {
      console.error(e);
      alert('참여 중 오류가 발생했습니다.');
    }
  };

  const handleHide = async () => {
    if (!selectedAppToHide) return;
    if (hidePin !== selectedAppToHide.pin) {
      setHideError('PIN 번호가 일치하지 않습니다.');
      return;
    }

    try {
      const docRef = doc(db, 'appointments', selectedAppToHide.id);
      await updateDoc(docRef, {
        isHidden: true
      });
      setHideModalOpen(false);
      alert('밥약이 목록에서 숨김 처리되었습니다.');
    } catch (e) {
      console.error(e);
      setHideError('숨김 처리 중 오류가 발생했습니다.');
    }
  };

  // --- Modal Control ---

  const openJoinModal = (appId) => {
    setSelectedAppId(appId);
    setJoinModalOpen(true);
  };

  const openHideModal = (app) => {
    setSelectedAppToHide(app);
    setHideModalOpen(true);
    setHideError('');
    setHidePin('');
  };
  
  const closeHideModal = () => {
    setHideModalOpen(false);
    setSelectedAppToHide(null);
    setHideError('');
    setHidePin('');
  };


  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans text-gray-800 relative pb-20">
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-orange-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-5 text-lg font-bold transition-all duration-300 border-b-4 ${
                activeTab === 'list'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-400 hover:text-orange-400'
              }`}
            >
              밥약 찾기 👀
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-5 text-lg font-bold transition-all duration-300 border-b-4 ${
                activeTab === 'create'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-400 hover:text-orange-400'
              }`}
            >
              밥약 만들기 ✍️
            </button>
          </div>
        </div>
      </nav>

      <main className="p-4 max-w-md mx-auto mt-4">
        {activeTab === 'create' ? (
          <BapyakForm onCreate={handleCreate} initialData={hostInfo} onFormChange={handleFormChange} />
        ) : (
          <>
            <div className="flex justify-end items-center mb-4 px-2">
              <label htmlFor="availability-toggle" className="mr-3 text-sm font-medium text-gray-700">
                정원 마감 제외
              </label>
              <div 
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${showOnlyAvailable ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showOnlyAvailable ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </div>
            </div>
            <BapyakList
              appointments={appointments}
              showOnlyAvailable={showOnlyAvailable}
              onJoinClick={openJoinModal}
              onHideClick={openHideModal}
            />
          </>
        )}
      </main>

      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSubmit={handleJoinSubmit}
      />

      <HideModal
        isOpen={hideModalOpen}
        onClose={closeHideModal}
        onConfirm={handleHide}
        pin={hidePin}
        setPin={setHidePin}
        error={hideError}
      />
    </div>
  );
}