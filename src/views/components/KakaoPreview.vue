<script setup lang="ts">
import { useKakaoStore } from '@/stores/kakaoStore'
import html2canvas from 'html2canvas'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import tailMine from '@/assets/img/tail_mine.svg'
import tailYours from '@/assets/img/tail_yours.svg'
import { SentPerson } from '@/types'

dayjs.locale('ko')

const kakaoStore = useKakaoStore()
const { phoneStatus, chatRoomInfo, uiSettings, messageList } = kakaoStore

const getInitial = (name: string) => name.charAt(0).toUpperCase()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
  if (target.parentElement) {
    target.parentElement.innerHTML = getInitial(chatRoomInfo.otherUserName)
    target.parentElement.classList.add('default-profile')
  }
}

const captureScreenshot = async () => {
  const screenshotFrame = document.querySelector('.screenshot-frame') as HTMLElement
  if (screenshotFrame) {
    try {
      const canvas = await html2canvas(screenshotFrame, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = 'kakao-screenshot.png'
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('스크린샷 생성 실패:', error)
      alert('스크린샷 생성에 실패했습니다.')
    }
  }
}

const isSameTime = (a: string | Date, b: string | Date) => {
  return dayjs(a).format('YYYY-MM-DD HH:mm') === dayjs(b).format('YYYY-MM-DD HH:mm')
}

const formatTime = (time: string | Date) => {
  if (typeof time === 'string' && (time.includes('오전') || time.includes('오후'))) {
    return time
  }
  return dayjs(time).format('A h:mm').replace('AM', '오전').replace('PM', '오후')
}

const isSameDate = (a: string | Date, b: string | Date) => {
  return dayjs(a).format('YYYY-MM-DD') === dayjs(b).format('YYYY-MM-DD')
}

const shouldShowDateChip = (idx: number) => {
  if (idx === 0) return chatRoomInfo.showFirstDateChip
  const prev = messageList[idx - 1]
  const curr = messageList[idx]
  return !isSameDate(prev.time, curr.time)
}

const formatDateChip = (time: string | Date) => {
  const date = dayjs(time)
  if (!date.isValid()) return ''
  return date.format('YYYY년 M월 D일 dddd')
}

const isLastInTimeGroup = (idx: number) => {
  const curr = messageList[idx]
  if (idx === messageList.length - 1) return true
  const next = messageList[idx + 1]
  return next.sender !== curr.sender || !isSameTime(curr.time, next.time)
}

const isFirstInProfileGroup = (idx: number) => {
  if (idx === 0) return true
  const prev = messageList[idx - 1]
  const curr = messageList[idx]
  return prev.sender !== curr.sender || !isSameTime(prev.time, curr.time)
}

const getMessageGroupClass = (idx: number) => {
  if (idx === 0) return 'group-start'
  const prev = messageList[idx - 1]
  const curr = messageList[idx]
  if (prev.sender !== curr.sender || !isSameTime(prev.time, curr.time)) {
    return 'group-start'
  }
  return 'group-middle'
}

const formatStatusBarTime = (time: string) => {
  // 숫자와 콜론만 추출 (예: '오후 2:30' → '2:30')
  const match = time.match(/(\d{1,2}:\d{2})/)
  return match ? match[1] : time
}
</script>
<template>
  <div class="kakao-preview">
    <div class="phone-frame">
      <div class="screenshot-frame">
        <div class="status-bar" :style="{ backgroundColor: uiSettings.messageBackgroundColor }">
          <div class="status-left">
            <span class="time">{{ formatStatusBarTime(phoneStatus.time) }}</span>
          </div>
          <div class="status-right">
            <span class="signal">
              <template v-if="phoneStatus.signalLevel >= 0">
                <svg
                  width="19"
                  height="12"
                  viewBox="0 0 19 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.3"
                    y="9"
                    width="3"
                    height="3"
                    rx="1.1"
                    :fill="phoneStatus.signalLevel >= 1 ? 'black' : '#889AA8'"
                  />
                  <rect
                    x="5.3"
                    y="6.5"
                    width="3"
                    height="5.5"
                    rx="1.1"
                    :fill="phoneStatus.signalLevel >= 2 ? 'black' : '#889AA8'"
                  />
                  <rect
                    x="10.3"
                    y="3"
                    width="3"
                    height="9"
                    rx="1.1"
                    :fill="phoneStatus.signalLevel >= 3 ? 'black' : '#889AA8'"
                  />
                  <rect
                    x="15.3"
                    y="1"
                    width="3"
                    height="11"
                    rx="1.1"
                    :fill="phoneStatus.signalLevel >= 4 ? 'black' : '#889AA8'"
                  />
                </svg>
              </template>
            </span>
            <span class="wifi">
              <template v-if="phoneStatus.wifiLevel === 'LTE'">
                <div style="display: flex; align-items: center">
                  <img
                    src="@/assets/img/lte.svg"
                    alt="LTE"
                    style="height: 12px; vertical-align: middle"
                  />
                </div>
              </template>
              <template v-else-if="phoneStatus.wifiLevel === '5G'">
                <div style="display: flex; align-items: center">
                  <img
                    src="@/assets/img/5g.svg"
                    alt="5G"
                    style="height: 12px; vertical-align: middle"
                  />
                </div>
              </template>
              <template v-else>
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.41468 8.91875C7.8344 7.69319 9.91383 7.69332 11.3336 8.91875C11.4051 8.98468 11.4469 9.07827 11.4489 9.17656C11.4508 9.2748 11.413 9.36943 11.3444 9.43828L9.12073 11.7283C9.05563 11.7956 8.96725 11.8337 8.87464 11.8338C8.78193 11.8338 8.69274 11.7956 8.62757 11.7283L6.40394 9.43828C6.33533 9.3694 6.29744 9.27476 6.29944 9.17656C6.30148 9.07827 6.34319 8.98463 6.41468 8.91875Z"
                    :fill="phoneStatus.wifiLevel >= 1 ? 'black' : '#889AA8'"
                  />
                  <path
                    d="M3.40882 6.17851C6.4679 3.27392 11.2052 3.27392 14.2643 6.17851C14.3333 6.24662 14.3727 6.34029 14.3737 6.43828C14.3745 6.53616 14.3368 6.63055 14.2692 6.7L12.984 8.02519C12.8516 8.16048 12.6374 8.16378 12.5016 8.03203C11.4971 7.1036 10.1907 6.58961 8.83558 6.58964C7.48126 6.59022 6.17541 7.10412 5.17151 8.03203C5.03564 8.16378 4.82153 8.16054 4.68909 8.02519L3.40394 6.7C3.33618 6.63064 3.29862 6.53621 3.29944 6.43828C3.30035 6.34031 3.33982 6.24661 3.40882 6.17851Z"
                    :fill="phoneStatus.wifiLevel >= 2 ? 'black' : '#889AA8'"
                  />
                  <path
                    d="M0.406865 3.44218C5.09872 -1.14743 12.5001 -1.14736 17.192 3.44218C17.2599 3.51037 17.2989 3.60373 17.2994 3.70097C17.2999 3.79806 17.262 3.89184 17.195 3.96074L15.9088 5.28593C15.7763 5.42191 15.561 5.42362 15.4264 5.28984C13.6388 3.55507 11.266 2.5878 8.79944 2.58769C6.33281 2.58781 3.96022 3.55507 2.17249 5.28984C2.03794 5.42373 1.82248 5.42208 1.69007 5.28593L0.402959 3.96074C0.33599 3.89181 0.298944 3.79803 0.299443 3.70097C0.30007 3.60373 0.3389 3.51032 0.406865 3.44218Z"
                    :fill="phoneStatus.wifiLevel >= 3 ? 'black' : '#889AA8'"
                  />
                </svg>
              </template>
            </span>
            <span class="battery">
              <svg
                width="28"
                height="13"
                viewBox="0 0 28 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.35"
                  d="M4.29944 0.5H21.2994C23.2324 0.5 24.7994 2.067 24.7994 4V9C24.7994 10.933 23.2324 12.5 21.2994 12.5H4.29944C2.36644 12.5 0.799439 10.933 0.799438 9V4C0.799438 2.067 2.36644 0.5 4.29944 0.5Z"
                  stroke="black"
                />
                <path
                  opacity="0.4"
                  d="M26.2994 5V9.22034C27.1485 8.86291 27.7006 8.0314 27.7006 7.11017C27.7006 6.18894 27.1485 5.35744 26.2994 5"
                  fill="black"
                />
                <path
                  d="M2.29944 4C2.29944 2.89543 3.19487 2 4.29944 2H21.2994C22.404 2 23.2994 2.89543 23.2994 4V9C23.2994 10.1046 22.404 11 21.2994 11H4.29944C3.19487 11 2.29944 10.1046 2.29944 9V4Z"
                  :fill="phoneStatus.battery <= 20 ? '#FF3B30' : 'black'"
                  :style="{ clipPath: `inset(0 ${100 - phoneStatus.battery}% 0 0)` }"
                />
              </svg>
            </span>
          </div>
        </div>
        <div class="kakao-header" :style="{ backgroundColor: uiSettings.messageBackgroundColor }">
          <div class="header-left">
            <button class="back-btn"><img src="@/assets/img/chevron_left.svg" alt="back" /></button>
            <span class="participant-badge" v-if="chatRoomInfo.unreadMessages > 0">{{
              chatRoomInfo.unreadMessages > 999 ? '999+' : chatRoomInfo.unreadMessages
            }}</span>
          </div>
          <div class="header-center">
            <div class="chat-title">{{ chatRoomInfo.title }}</div>
          </div>
          <div class="header-right">
            <button class="search-btn">
              <img src="@/assets/img/magnifying_glass.svg" alt="search" />
            </button>
            <button class="menu-btn"><img src="@/assets/img/hamburger.svg" alt="menu" /></button>
          </div>
        </div>

        <div v-if="chatRoomInfo.noticeVisible && chatRoomInfo.notice" class="notice">
          <img src="@/assets/img/horn.svg" alt="notice" />
          <span class="notice-text">{{ chatRoomInfo.notice }}</span>
          <i class="fa-solid fa-chevron-down notice-chevron"></i>
        </div>
        <div
          class="messages-container"
          :style="{
            backgroundColor: uiSettings.messageBackgroundColor,
            paddingTop: chatRoomInfo.noticeVisible && chatRoomInfo.notice ? '40px' : '0px',
          }"
        >
          <div v-for="(message, idx) in messageList" :key="message.id">
            <div v-if="shouldShowDateChip(idx)" class="date-chip">
              <img src="@/assets/img/calendar.svg" alt="calendar" />
              <span>{{ formatDateChip(message.time) }}</span>
              <i class="fa-solid fa-chevron-right"></i>
            </div>
            <div
              :class="[
                'message-wrapper',
                getMessageGroupClass(idx),
                message.sender === SentPerson.ME ? 'my-message' : 'other-message',
              ]"
            >
              <div
                v-if="message.sender === 'other'"
                class="other-message-container"
                :class="{
                  'group-start': isFirstInProfileGroup(idx),
                  'group-middle': !isFirstInProfileGroup(idx),
                }"
              >
                <div class="profile-image" v-if="isFirstInProfileGroup(idx)">
                  <img
                    v-if="chatRoomInfo.otherUserProfile"
                    :src="chatRoomInfo.otherUserProfile"
                    :alt="chatRoomInfo.otherUserName"
                    @error="handleImageError"
                  />
                  <img
                    v-else
                    src="@/assets/img/default_profile.svg"
                    alt="default profile"
                    class="default-profile-image"
                  />
                </div>
                <div class="profile-image" v-else style="visibility: hidden"></div>
                <div class="message-content-wrapper">
                  <div class="sender-name" v-if="isFirstInProfileGroup(idx)">
                    {{ chatRoomInfo.otherUserName }}
                  </div>
                  <div class="message-row">
                    <div class="message-bubble other-bubble">
                      {{ message.content }}
                      <img class="bubble-tail yours" :src="tailYours" alt="your tail" />
                    </div>
                    <div class="message-meta">
                      <div v-if="isLastInTimeGroup(idx)">
                        <div v-if="!message.isRead" class="read-status unread">1</div>
                        <div class="message-time">{{ formatTime(message.time) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="my-message-container">
                <div class="message-meta">
                  <div v-if="isLastInTimeGroup(idx)">
                    <div v-if="!message.isRead" class="read-status unread">1</div>
                    <template v-if="message.status === 'sending'">
                      <span class="sending-icon">
                        <img src="@/assets/img/sending.svg" alt="sending" />
                      </span>
                      <span class="message-time">{{ formatTime(message.time) }}</span>
                    </template>
                    <template v-else-if="message.status === 'failed'">
                      <span class="failed-element">
                        <div class="failed-chip">
                          <img src="@/assets/img/retry.svg" alt="retry" />
                          <div class="failed-divider" />
                          <img src="@/assets/img/cancel.svg" alt="cancel" />
                        </div>
                      </span>
                    </template>
                    <template v-else>
                      <span class="message-time">{{ formatTime(message.time) }}</span>
                    </template>
                  </div>
                </div>
                <div class="message-bubble my-bubble">
                  {{ message.content }}
                  <img class="bubble-tail mine" :src="tailMine" alt="my tail" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="input-area">
          <button class="plus-btn"><img src="@/assets/img/plus.svg" alt="plus" /></button>
          <div class="input-field-wrapper">
            <input
              class="input-field preview-typing-input"
              v-model="kakaoStore.typingText"
              placeholder="메시지 입력"
              rows="1"
              readonly
            />
            <button class="emoji-btn">
              <img src="@/assets/img/smile.svg" alt="emoji" />
            </button>
          </div>
          <button class="hashtag-btn">
            <img src="@/assets/img/sharp.svg" alt="hashtag" />
          </button>
        </div>
        <div class="safe-area-padding">
          <div class="safe-area-bar"></div>
        </div>
      </div>
    </div>
    <div class="preview-actions">
      <button @click="captureScreenshot" class="btn capture-btn">📸 스크린샷 저장</button>
    </div>
    <div class="dynamic-island">
      <span class="island-content"></span>
    </div>
  </div>
</template>
<style scoped>
.kakao-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #ffffff;
  border: 8px solid #000;
  border-radius: 40px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  position: relative;
}

.screenshot-frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 상단바 */
.status-bar {
  height: 50px;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  font-size: 16px;
  font-weight: 600;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.status-left .time {
  font-weight: 500;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  gap: 8px;
}

.status-right .wifi i {
  color: black;
}

.status-right .battery i {
  color: black;
  font-size: 20px;
}

/* 카카오톡 헤더 */
.kakao-header {
  height: 88px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 24px 16px 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .participant-badge {
  display: flex;
  align-items: center;
  margin-left: -6px;
}

.participant-badge {
  color: black;
  font-size: 16px;
  padding: 2px 6px;
  min-width: 16px;
  text-align: center;
}

.back-btn,
.search-btn,
.menu-btn {
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-btn img {
  width: 22px;
}

.search-btn img {
  width: 22px;
}

.menu-btn {
  display: flex;
  align-items: center;
}

.menu-btn img {
  width: 22px;
}

.header-center {
  flex: 1;
  text-align: center;
}

.chat-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  white-space: pre;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

/* 공지사항 */
.notice {
  background: #ffffff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 88px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 95%;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.notice-icon {
  font-size: 14px;
}

.notice-text {
  font-size: 14px;
  color: #191919;
  flex: 1;
}

.notice-chevron {
  margin-left: 8px;
}

/* 메시지 영역 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 20px 16px;
  transition: background-color 0.3s ease;
}

.message-wrapper {
  margin-bottom: 0 !important;
}

/* 상대방 메시지 */
.other-message-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.profile-image {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-profile {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

.message-content-wrapper {
  flex: 1;
  max-width: calc(100% - 56px);
}

.sender-name {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
  margin-left: 4px;
  font-weight: 500;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.other-bubble {
  background: white;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 내 메시지 */
.my-message-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 6px;
  position: relative;
}

.my-bubble {
  position: relative;
  background: #fee500;
  color: #381e1e;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-bubble {
  max-width: 260px;
  padding: 9px 14px;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
}

.my-message-container .message-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: end;
  min-width: 20px;
  margin: 0 4px;
}

.other-message-container .message-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  min-width: 20px;
  margin: 0 4px;
}

.read-status.unread {
  color: #fee500;
  font-weight: bold;
  font-size: 11px;
  margin-bottom: 2px;
}

.message-time {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

/* 입력창 */
.input-area {
  height: 40px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
}

.input-field-wrapper {
  display: flex;
  width: 100%;
  height: 32px;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border: none;
  background: #f6f6f6;
  border-radius: 18px;
  padding: 0 16px;
}

.plus-btn,
.emoji-btn,
.hashtag-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #191919;
  padding: 8px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-btn,
.hashtag-btn {
  width: 28px;
  height: 28px;
  font-size: 16px;
  border-radius: 32px;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.emoji-btn img {
  width: 20px;
}

.input-field {
  flex: 1;
  background: #f6f6f6;
  border: none;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.input-field::placeholder {
  color: #a7a7a7;
}

.input-field:focus {
  border: none;
  box-shadow: none;
  outline: none;
}
.preview-typing-input {
  resize: none;
  width: 100%;
  color: #191919;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.safe-area-padding {
  width: 100%;
  height: 30px;
  position: relative;
}

.safe-area-bar {
  width: 40%;
  height: 5px;
  background-color: black;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  bottom: 10px;
  border-radius: 5px;
}

/* 액션 버튼 */
.preview-actions {
  margin-top: 20px;
}

.capture-btn {
  background: #4a90e2;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
}

.capture-btn:hover {
  background: #357abd;
}

/* 스크롤바 숨기기 */
.messages-container::-webkit-scrollbar {
  display: none;
}

.messages-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 반응형 */
@media (max-width: 480px) {
  .phone-frame {
    width: 320px;
    height: 690px;
  }

  .message-bubble {
    max-width: 220px;
  }
}

.dynamic-island {
  position: absolute;
  top: 17px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: #333;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.island-content {
  padding: 0 10px;
}

.date-chip {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0 18px 0;
  font-size: 12px;
  color: #fff;
  line-height: 1.2;
  background: rgba(0, 0, 0, 0.13);
  border-radius: 16px;
  padding: 6px 10px;
  width: fit-content;
  min-width: 120px;
  margin-left: auto;
  margin-right: auto;
  gap: 4px;
}

.date-chip img {
  width: 12px;
}

.date-chip i {
  font-size: 10px;
}

.other-message-container.group-start {
  margin-top: 12px;
}
.other-message-container.group-middle {
  margin-top: 4px;
}

.message-wrapper.group-start {
  margin-top: 12px;
}
.message-wrapper.group-middle {
  margin-top: 4px;
}

.bubble-tail {
  position: absolute;
  width: 8px;
  height: 11px;
  z-index: 1;
  pointer-events: none;
}
.my-bubble {
  position: relative;
}
.bubble-tail.mine {
  right: -3px;
  top: 0px;
}
.other-bubble {
  position: relative;
}
.bubble-tail.yours {
  left: -3px;
  top: 0px;
}

.sending-icon {
  display: inline-block;
  height: 9px;
  margin-right: 4px;
}

.sending-icon img {
  height: 100%;
}

.failed-element {
  /* 전송실패 엘리먼트 스타일 영역 - 여기에 직접 작성 */
}

.failed-chip {
  width: 50px;
  height: 24px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  padding: 0 4px;
}

.failed-chip img {
  width: 10px;
}

.failed-divider {
  width: 1px;
  height: 24px;
  background-color: #f5f5f5;
}
</style>
