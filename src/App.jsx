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
import { Plus, EyeOff, Users, Mail } from 'lucide-react';
import { notifyParticipants } from './utils/notification'; // Import utility

import CalendarView from './CalendarView';
import BapyakList from './BapyakList';
import JoinModal from './JoinModal';
import PinVerificationModal from './PinVerificationModal';
import CheckMembersModal from './CheckMembersModal';
import CreateBapyakModal from './CreateBapyakModal';
import HowToUse from './HowToUse';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Changed to null initially

  const [hostInfo, setHostInfo] = useState({
    name: '',
    studentId: '',
    instagramId: '',
    email: '', // Add email to state
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
    console.log('Fetching data...'); // Added for debugging
    const q = query(collection(db, 'appointments'), where("isHidden", "==", false), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const appData = { id: doc.id, ...doc.data() };
        console.log('Fetched appointment:', appData); // Log fetched data
        return appData;
      });
      setAppointments(data);
    });
    return () => unsubscribe();
  }, []);

  // --- Event Handlers ---

  const handleFormChange = (newHostInfo) => {
    setHostInfo(prev => ({ ...prev, ...newHostInfo }));
  };

  // App.jsx 내부의 handleDateSelect 함수 수정
  const handleDateSelect = (date) => {
    // 만약 이미 선택된 날짜를 또 눌렀다면?
    if (selectedDate && isSameDay(date, selectedDate)) {
      // null로 만들어서 '전체 캘린더' 모드로 돌아갑니다.
      setSelectedDate(null);
    } else {
      // 다른 날짜를 눌렀다면 해당 날짜를 선택합니다.
      setSelectedDate(date);
    }
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = selectedDate
    ? appointments.filter(app => isSameDay(parseISO(app.date), selectedDate))
    : [];

  // --- Create Bapyak ---
  const handleCreateBapyak = async (formData) => {
    try {
      const newAppointmentData = {
        ...formData,
        isHidden: false,
        participants: [
          {
            name: formData.name,
            studentId: formData.studentId,
            instaId: formData.instagramId,
            email: formData.email,
            role: formData.hostRole, // Add host role
            isHost: true,
          },
        ],
        createdAt: serverTimestamp(),
      };
      console.log('Creating appointment with:', newAppointmentData); // Log data being sent
      await addDoc(collection(db, 'appointments'), newAppointmentData);

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

      // 현재 밥약 정보 가져오기 (알림 트리거 체크용)
      const currentApp = appointments.find(app => app.id === selectedAppIdForJoin);

      await updateDoc(docRef, {
        participants: arrayUnion({
          ...joinData,
          isHost: false,
        }),
      });

      setJoinModalOpen(false);
      alert('참여 완료! 밥약에서 만나요 👋');

      // 풀방(Full) 체크
      if (currentApp) {
        // 방금 참여한 인원까지 포함하여 계산
        const currentCount = currentApp.participants.length;
        const maxCount = currentApp.maxCount;

        if (currentCount + 1 === maxCount) {
          // Cloud Functions가 'update' 이벤트를 감지하여 자동으로 알림을 보냅니다.
          console.log('밥약 매칭 완료! 이메일 발송이 예약되었습니다 (Server-side).');
          // notifyParticipants(updatedApp); // 더 이상 클라이언트에서 호출하지 않아도 됨 (하지만 로그용으로 남겨둘 수도 있음)
        }
      }

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
        alert('밥약이 삭제되었습니다.');
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
    <div className="min-h-screen flex flex-col bg-white text-black font-sans rounded-none lg:grid lg:grid-cols-2">
      {/* ★ 최상단 사이트 제목 (Header) */}
      <header className="w-full border-b-[3px] border-black py-6 bg-white z-[120] relative lg:col-span-2">
        <h1 className="text-3xl md:text-4xl font-black text-center tracking-tighter uppercase">
          🍚밥팅 - 밥약 매칭 사이트
        </h1>
        <h2 className="text-lg text-[#bc0000] md:text-xl font-bold text-center tracking-tighter">
          for KNU MED
        </h2>
      </header>
      {/* Left Column: Calendar */}
      <div className={`w-full transition-all duration-500 flex flex-col ${selectedDate === null ? 'flex-1 lg:col-span-2' : 'h-[40vh] p-4'} lg:min-h-[500px]`}>
        <div className="w-full h-full">
          <CalendarView
            appointments={appointments}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Right Column: Appointment List (only visible when date is selected) */}
      {selectedDate !== null && (
        <div className="flex-1 p-4 max-w-md mx-auto w-full animate-fade-in-up lg:border-l-[1.5px] border-black lg:min-h-[500px]">
          <h2 className="text-xl font-black text-black mb-6 uppercase tracking-tight border-b-2 border-black pb-2 inline-block">
            {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} 밥약
          </h2>
          {appointmentsForSelectedDate.length > 0 ? (
            <BapyakList
              appointments={appointmentsForSelectedDate}
              onJoinClick={openJoinModal}
              onHideClick={(app) => openPinVerificationModal(app, 'hide')}
              onCheckMembersClick={(app) => openPinVerificationModal(app, 'checkMembers')}
            />
          ) : (
            <p className="text-center text-gray-600">선택된 날짜에 밥약이 없습니다.</p>
          )}
        </div>
      )}

      {/* How To Use Section */}
      <HowToUse />

      {/* Floating Action Button */}
      <button
        onClick={() => setCreateBapyakModalOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-5 rounded-none shadow-lg hover:bg-white hover:text-black transition-all active:scale-95 border-[1.5px] border-black z-[1000] cursor-pointer"
        aria-label="Create new Bapyak"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSubmit={handleJoinSubmit}
        appointment={appointments.find(app => app.id === selectedAppIdForJoin)}
      />

      <PinVerificationModal
        isOpen={pinVerificationModalOpen}
        onClose={closePinVerificationModal}
        onVerify={handlePinVerification}
        pin={pinInput}
        setPin={setPinInput}
        error={pinError}
        title={pinVerificationContext === 'hide' ? '밥약 삭제' : '참여 멤버 확인'}
        description={pinVerificationContext === 'hide' ? '이 밥약을 목록에서 삭제합니다. PIN 번호를 입력하여 확인해주세요.' : '참여 멤버를 확인하려면 PIN 번호를 입력하세요.'}
        confirmButtonText={pinVerificationContext === 'hide' ? '삭제 확인' : '확인'}
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
      <footer className="p-4 max-w-md mx-auto text-center text-black text-sm lg:col-span-2">
        <p>문의 및 버그 제보: <a href="mailto:ssy060604@gmail.com" className="text-black underline">ssy060604@gmail.com</a></p>
        <p>서버와 이메일 알림 기능을 유지하려면 비용이 들어갑니다</p>
        <p>서버 유지에 도움을 주세요🥹: <a href="https://qr.kakaopay.com/FFw7bhUqa" className="text-black underline">https://qr.kakaopay.com/FFw7bhUqa</a></p>
      </footer>
    </div>
  );
}
