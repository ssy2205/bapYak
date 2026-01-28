import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { format, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus, EyeOff, Users } from 'lucide-react';

import CalendarView from './CalendarView';
import BapyakList from './BapyakList';
import JoinModal from './JoinModal';
import PinVerificationModal from './PinVerificationModal';
import CheckMembersModal from './CheckMembersModal';
import CreateBapyakModal from './CreateBapyakModal';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarFullScreen, setIsCalendarFullScreen] = useState(true); // New state for calendar layout

  const [hostInfo, setHostInfo] = useState({
    name: '',
    studentId: '',
    instagramId: '',
  });

  // Join Modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedAppIdForJoin, setSelectedAppIdForJoin] = useState(null);

  // Pin Verification Modal state
  const [pinVerificationModalOpen, setPinVerificationModalOpen] = useState(false);
  const [pinVerificationContext, setPinVerificationContext] = useState(null); // 'hide' or 'checkMembers'
  const [selectedAppForPinVerification, setSelectedAppForPinVerification] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Check Members Modal state
  const [checkMembersModalOpen, setCheckMembersModalOpen] = useState(false);
  const [membersToShow, setMembersToShow] = useState([]);
  const [appForMembersModal, setAppForMembersModal] = useState(null);

  // Create Bapyak Modal state
  const [createBapyakModalOpen, setCreateBapyakModalOpen] = useState(false);


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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarFullScreen(false); // Shrink calendar when a date is selected
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(app =>
    isSameDay(parseISO(app.date), selectedDate)
  );

  // --- Create Bapyak ---
  const handleCreateBapyak = async (formData) => {
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        isHidden: false,
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
      setCreateBapyakModalOpen(false); // Close modal after creation
    } catch (e) {
      console.error(e);
      alert('에러가 발생했습니다.');
    }
  };

  // --- Join Bapyak ---
  const openJoinModal = (appId) => {
    setSelectedAppIdForJoin(appId);
    setJoinModalOpen(true);
  };

  const handleJoinSubmit = async (joinData) => {
    try {
      const docRef = doc(db, 'appointments', selectedAppIdForJoin);
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

  // --- Pin Verification Logic ---
  const openPinVerificationModal = (app, context) => {
    setSelectedAppForPinVerification(app);
    setPinVerificationContext(context);
    setPinVerificationModalOpen(true);
    setPinInput('');
    setPinError('');
  };

  const closePinVerificationModal = () => {
    setPinVerificationModalOpen(false);
    setSelectedAppForPinVerification(null);
    setPinVerificationContext(null);
    setPinInput('');
    setPinError('');
  };

  const handlePinVerification = async () => {
    if (!selectedAppForPinVerification) return;

    if (pinInput !== selectedAppForPinVerification.pin) {
      setPinError('PIN 번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (pinVerificationContext === 'hide') {
        const docRef = doc(db, 'appointments', selectedAppForPinVerification.id);
        await updateDoc(docRef, { isHidden: true });
        alert('밥약이 목록에서 숨김 처리되었습니다.');
      } else if (pinVerificationContext === 'checkMembers') {
        setMembersToShow(selectedAppForPinVerification.participants);
        setAppForMembersModal(selectedAppForPinVerification);
        setCheckMembersModalOpen(true);
      }
      closePinVerificationModal();
    } catch (e) {
      console.error(e);
      setPinError('처리 중 오류가 발생했습니다.');
    }
  };

  const closeCheckMembersModal = () => {
    setCheckMembersModalOpen(false);
    setMembersToShow([]);
    setAppForMembersModal(null);
  };


  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 relative pb-20">
      <main className={`p-4 max-w-md mx-auto mt-4 transition-all duration-500 ${isCalendarFullScreen ? 'h-screen flex flex-col justify-center' : ''}`}>
        <CalendarView
          appointments={appointments}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          isFullScreen={isCalendarFullScreen} // Pass prop to CalendarView
        />

        {/* Appointment List Section */}
        {!isCalendarFullScreen && ( // Conditionally render list
          <div className="bg-white rounded-none p-6 shadow-none border border-gray-300 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} 밥약
            </h2>
            <BapyakList
              appointments={appointmentsForSelectedDate}
              onJoinClick={openJoinModal}
              onHideClick={(app) => openPinVerificationModal(app, 'hide')}
              onCheckMembersClick={(app) => openPinVerificationModal(app, 'checkMembers')}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setCreateBapyakModalOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-5 rounded-none shadow-lg hover:bg-gray-800 transition-all active:scale-95"
        aria-label="Create new Bapyak"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSubmit={handleJoinSubmit}
      />

      <PinVerificationModal
        isOpen={pinVerificationModalOpen}
        onClose={closePinVerificationModal}
        onVerify={handlePinVerification}
        pin={pinInput}
        setPin={setPinInput}
        error={pinError}
        title={pinVerificationContext === 'hide' ? '밥약 숨기기' : '참여 멤버 확인'}
        description={pinVerificationContext === 'hide' ? '이 밥약을 목록에서 숨깁니다. PIN 번호를 입력하여 확인해주세요.' : '참여 멤버를 확인하려면 PIN 번호를 입력하세요.'}
        confirmButtonText={pinVerificationContext === 'hide' ? '숨기기 확인' : '확인'}
        confirmButtonIcon={pinVerificationContext === 'hide' ? EyeOff : Users}
      />

      <CheckMembersModal
        isOpen={checkMembersModalOpen}
        onClose={closeCheckMembersModal}
        participants={membersToShow}
        app={appForMembersModal}
      />

      <CreateBapyakModal
        isOpen={createBapyakModalOpen}
        onClose={() => setCreateBapyakModalOpen(false)}
        onCreate={handleCreateBapyak}
        initialData={hostInfo}
      />

      {/* Bug Report/Inquiry Section */}
      <footer className="p-4 max-w-md mx-auto mt-8 text-center text-gray-600 text-sm">
        <p>문의 및 버그 제보: <a href="mailto:bobfriends.support@example.com" className="text-black underline">bobfriends.support@example.com</a></p>
      </footer>
    </div>
  );
}