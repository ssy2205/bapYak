/**
 * 밥약 참여자 알림 유틸리티
 * 
 * [변경사항]
 * 기존에는 클라이언트(브라우저)에서 시뮬레이션 로그를 출력했으나,
 * 이제 Firebase Cloud Functions ('sendFullNotification') 에서
 * 밥약이 꽉 찼을 때(full) 자동으로 이메일을 발송합니다.
 * 
 * 따라서 이 함수는 더 이상 직접적인 알림 로직을 수행하지 않습니다.
 * 추후 클라이언트 측에서 "매칭 완료!" 같은 토스트 메시지를 띄우는 용도로 재활용할 수 있습니다.
 */
export const notifyParticipants = async (appointment) => {
    console.log('[Client] 밥약 매칭 완료 감지.');
    console.log('[Client] 서버(Cloud Functions)에서 자동으로 알림 메일을 발송할 예정입니다.');

    // 클라이언트 측 추가 작업이 필요하다면 여기에 작성
    return Promise.resolve(true);
};
