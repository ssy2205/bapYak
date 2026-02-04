/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");

// 1. Nodemailer Transporter 설정 (기본값: Gmail)
// 주의: Gmail 앱 비밀번호를 사용해야 합니다. 
// 보안을 위해 실제 배포 시에는 환경 변수(defineSecret)를 사용하는 것이 좋습니다.
// secrets: [gmailAppPassword] 옵션을 onDocumentUpdated에 전달해야 합니다.
exports.sendFullNotification = onDocumentUpdated({
    region: "asia-northeast3", // Firestore와 동일한 리전 설정
    document: "appointments/{appointmentId}",
    secrets: [gmailAppPassword],
}, async (event) => {

    // Transporter는 함수 내부에서 초기화하거나, 함수 실행 시 비밀 값을 참조해야 안전합니다.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ssy060604@gmail.com",
            pass: gmailAppPassword.value(), // Secret 값 참조
        },
    });

    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    const maxSenior = afterData.maxSenior || (afterData.maxCount ? afterData.maxCount / 2 : 1);
    const maxJunior = afterData.maxJunior || (afterData.maxCount ? afterData.maxCount / 2 : 1);

    const seniorCount = afterData.participants.filter(p => p.role === 'Senior').length;
    const juniorCount = afterData.participants.filter(p => p.role === 'Junior').length;

    const beforeSeniorCount = beforeData.participants.filter(p => p.role === 'Senior').length;
    const beforeJuniorCount = beforeData.participants.filter(p => p.role === 'Junior').length;

    const isFullNow = seniorCount >= maxSenior && juniorCount >= maxJunior;
    const wasFullBefore = beforeSeniorCount >= maxSenior && beforeJuniorCount >= maxJunior;

    // 1. 로직 체크:
    // - 이전에는 꽉 차지 않았고 (!wasFullBefore)
    // - 지금 막 꽉 찼을 때 (isFullNow)
    if (!wasFullBefore && isFullNow) {

        logger.info(`[${afterData.name}] 밥약이 매칭되었습니다! (${event.params.appointmentId}). 선배: ${seniorCount}/${maxSenior}, 후배: ${juniorCount}/${maxJunior}`);

        // 2. 모든 참여자에게 이메일 발송
        const participants = afterData.participants;

        // 참여자 목록 문자열 생성
        const participantsList = participants.map((p, index) =>
            `${index + 1}. [${p.role === 'Senior' ? '선배' : '후배'}] ${p.name} (${p.studentId}) - @${p.instaId}`
        ).join('\n');

        const emailPromises = participants.map((participant) => {
            if (!participant.email) {
                logger.warn(`User ${participant.name} has no email.`);
                return null;
            }

            const mailOptions = {
                from: '"밥팅 알리미" <noreply@bobting.com>',
                to: participant.email,
                subject: `[밥팅] '${afterData.name}' 밥약 매칭 완료! (${afterData.date})`,
                text: `안녕하세요 ${participant.name}님,\n\n신청하신 밥약 '${afterData.name}'의 멤버가 모두 모였습니다!\n\n[밥약 정보]\n일시: ${afterData.date} ${afterData.timeSlot === 'Lunch' ? '점심' : '저녁'}\n장소 및 메뉴: ${afterData.intro}\n\n[참여자 목록]\n${participantsList}\n\n서로 연락해서 즐거운 식사 되세요! 🍚`,
            };

            return transporter.sendMail(mailOptions)
                .then(() => logger.info(`Email sent to ${participant.email}`))
                .catch((err) => logger.error(`Error sending email to ${participant.email}:`, err));
        });

        await Promise.all(emailPromises);
    } else {
        // 아무 작업도 하지 않음
        return null;
    }
});
