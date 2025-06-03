<script setup lang="ts">
import { reactive } from 'vue'
import { useKakaoStore } from '@/stores/kakaoStore'
import type { Message } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { MessageStatus, SentPerson, getMessageStatusText } from '@/types'

dayjs.locale('ko')

const kakaoStore = useKakaoStore()

const newMessage = reactive<Omit<Message, 'id'> & { time: Date }>({
  sender: SentPerson.ME,
  content: '',
  time: new Date(),
  isRead: true,
  status: MessageStatus.SENT,
})

const handleSubmit = () => {
  if (newMessage.content.trim() && newMessage.time) {
    kakaoStore.addMessage({
      ...newMessage,
      time: new Date(newMessage.time),
      status: newMessage.status,
    })
    newMessage.content = ''
  }
}

const formatTime = (date: Date) => {
  return dayjs(date).format('A h:mm').replace('AM', '오전').replace('PM', '오후')
}
</script>
<template>
  <div class="card">
    <h3>메시지 추가</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="typing-text">작성중인 메시지</label>
        <textarea
          id="typing-text"
          :value="kakaoStore.typingText"
          @input="e => kakaoStore.typingText = (e.target as HTMLTextAreaElement).value"
          placeholder="미리보기 입력창에 표시될 텍스트"
          maxlength="15"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="sender">보낸 사람</label>
        <select id="sender" v-model="newMessage.sender">
          <option value="me">나</option>
          <option value="other">상대방</option>
        </select>
      </div>
      <div class="form-group" v-if="newMessage.sender === SentPerson.ME">
        <label for="status">메시지 상태</label>
        <select id="status" v-model="newMessage.status">
          <option v-for="status in Object.values(MessageStatus)" :key="status" :value="status">
            {{ getMessageStatusText(status) }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="content">메시지 내용</label>
        <textarea
          id="content"
          v-model="newMessage.content"
          placeholder="메시지를 입력하세요"
          required
        ></textarea>
      </div>
      <div class="two-column">
        <div class="form-group">
          <label for="time">전송 시간</label>
          <DatePicker
            v-model="newMessage.time"
            mode="dateTime"
            :minute-increment="1"
            :format="formatTime"
            :masks="{ input: 'a h:mm' }"
            locale="ko"
          />
        </div>
        <div class="form-group">
          <label for="is-read">읽음 여부</label>
          <select id="is-read" v-model="newMessage.isRead">
            <option :value="true">읽음</option>
            <option :value="false">안읽음</option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn">메시지 추가</button>
    </form>
  </div>
</template>
