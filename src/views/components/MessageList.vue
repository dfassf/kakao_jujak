<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useKakaoStore } from '@/stores/kakaoStore'
import { SentPerson, type Message } from '@/types'

const kakaoStore = useKakaoStore()
const { messageList, chatRoomInfo, removeMessage, updateMessage } = kakaoStore

const editingId = ref<string | null>(null)
const editForm = reactive({
  content: '',
  time: '' as string | Date,
  isRead: true,
})

const startEdit = (message: Message) => {
  editingId.value = message.id
  editForm.content = message.content
  editForm.time = message.time
  editForm.isRead = message.isRead
}

const saveEdit = (id: string) => {
  updateMessage(id, {
    content: editForm.content,
    time: editForm.time,
    isRead: editForm.isRead,
  })
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editForm.content = ''
  editForm.time = ''
  editForm.isRead = true
}
</script>
<template>
  <div class="card">
    <h3>메시지 목록</h3>
    <div v-if="messageList.length === 0" class="empty-state">아직 추가된 메시지가 없습니다.</div>

    <div v-else class="message-list">
      <div
        v-for="message in messageList"
        :key="message.id"
        class="message-item"
        :class="{
          'message-me': message.sender === SentPerson.ME,
          'message-other': message.sender === SentPerson.OTHER,
        }"
      >
        <div class="message-header">
          <span class="message-sender">
            {{ message.sender === SentPerson.ME ? '나' : chatRoomInfo.otherUserName }}
          </span>
          <span class="message-time">{{ String(message.time) }}</span>
          <span class="message-read" :class="{ unread: !message.isRead }">
            {{ message.isRead ? '읽음' : '안읽음' }}
          </span>
          <button @click="removeMessage(message.id)" class="btn-delete">삭제</button>
        </div>
        <div class="message-content">{{ message.content }}</div>
        <div v-if="editingId === message.id" class="edit-form">
          <textarea v-model="editForm.content" placeholder="메시지 내용"></textarea>
          <input
            :value="String(editForm.time)"
            @input="editForm.time = ($event.target as HTMLInputElement).value"
            placeholder="시간"
          />
          <select v-model="editForm.isRead">
            <option :value="true">읽음</option>
            <option :value="false">안읽음</option>
          </select>
          <div class="edit-buttons">
            <button @click="saveEdit(message.id)" class="btn">저장</button>
            <button @click="cancelEdit()" class="btn btn-secondary">취소</button>
          </div>
        </div>

        <button v-else @click="startEdit(message)" class="btn-edit">수정</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background: #fafafa;
}

.message-item.message-me {
  background: #e3f2fd;
  border-color: #bbdefb;
}

.message-item.message-other {
  background: #f3e5f5;
  border-color: #d1c4e9;
}

.message-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
}

.message-sender {
  font-weight: bold;
  color: #666;
}

.message-time {
  color: #999;
}

.message-read {
  color: #4caf50;
}

.message-read.unread {
  color: #f44336;
}

.btn-delete,
.btn-edit {
  font-size: 11px;
  padding: 3px 8px;
  margin-left: auto;
}

.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn-edit {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.message-content {
  white-space: pre-wrap;
  line-height: 1.4;
}

.edit-form {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.edit-form textarea,
.edit-form input,
.edit-form select {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
}

.edit-buttons {
  display: flex;
  gap: 10px;
}

.edit-buttons button {
  font-size: 12px;
  padding: 5px 15px;
}
</style>
