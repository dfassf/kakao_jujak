<script setup lang="ts">
import { useKakaoStore } from '@/stores/kakaoStore'

const kakaoStore = useKakaoStore()
const { chatRoomInfo } = kakaoStore
</script>
<template>
  <div class="card">
    <h3>대화방 정보</h3>
    <div class="form-group">
      <label for="room-title">대화방 제목</label>
      <input id="room-title" v-model="chatRoomInfo.title" type="text" placeholder="친구와의 대화" />
    </div>

    <div class="two-column">
      <div class="form-group">
        <label for="participant-count">안읽은 메시지 수</label>
        <input
          id="participant-count"
          v-model.number="chatRoomInfo.unreadMessages"
          type="number"
          min="0"
          placeholder="0"
        />
      </div>
      <div class="form-group">
        <label for="other-user-name">상대방 이름</label>
        <input
          id="other-user-name"
          v-model="chatRoomInfo.otherUserName"
          type="text"
          placeholder="홍길동"
        />
      </div>
    </div>

    <div class="form-group">
      <div class="label-with-tooltip">
        <label for="other-user-profile">상대방 프로필 사진 URL</label>
        <div class="tooltip-container">
          <span class="tooltip-icon">?</span>
          <span class="tooltip-text">
            아직 파일 업로드 기능을 직접 제공하고 있지 않아 URL을 입력해 주세요😭
          </span>
        </div>
      </div>
      <input
        id="other-user-profile"
        v-model="chatRoomInfo.otherUserProfile"
        type="url"
        placeholder="https://example.com/profile.jpg"
      />
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="chatRoomInfo.showFirstDateChip" />
        <span>첫 메시지에 날짜 표시</span>
      </label>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="chatRoomInfo.noticeVisible" />
        <span>공지사항 표시</span>
      </label>
      <input
        v-if="chatRoomInfo.noticeVisible"
        id="notice"
        v-model="chatRoomInfo.notice"
        type="text"
        placeholder="공지사항을 입력하세요"
      />
    </div>
  </div>
</template>
<style scoped>
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 14px;
  color: #333;
}

.label-with-tooltip {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  margin-bottom: 5px;
}

.tooltip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: #ccc;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  cursor: help;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  width: 250px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  line-height: 1.4;
}

.tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}
</style>
