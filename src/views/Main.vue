<script setup lang="ts">
import { computed } from 'vue'
import { useKakaoStore } from '@/stores/kakaoStore'
import PhoneStatusForm from '@/views/components/PhoneStatusForm.vue'
import ChatRoomForm from '@/views/components/ChatRoomForm.vue'
import MessageForm from '@/views/components/MessageForm.vue'
import MessageList from '@/views/components/MessageList.vue'
import KakaoPreview from '@/views/components/KakaoPreview.vue'

const kakaoStore = useKakaoStore()

const previewData = computed(() => kakaoStore.getKakaoData())

const exportData = () => {
  const data = kakaoStore.getKakaoData()
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = 'kakao-talk-data.json'
  link.click()
}

const copyData = () => {
  const dataStr = JSON.stringify(previewData.value, null, 2)
  navigator.clipboard
    .writeText(dataStr)
    .then(() => {})
    .catch((err) => {
      console.error('복사 실패:', err)
      alert('복사에 실패했습니다. 다시 시도해주세요.')
    })
}

const resetAll = () => {
  if (!confirm('모든 데이터를 초기화하시겠습니까?')) return
  kakaoStore.resetData()
}

const clearStorage = () => {
  if (!confirm('저장된 대화 데이터를 초기화하시겠습니까?')) return
  localStorage.removeItem('kakao-talk-data')
  window.location.reload()
}
</script>

<template>
  <header class="app-header">
    <h1>📱 주주작작 주작작</h1>
    <p>원하는 카카오톡 대화를 만들어 보세요!</p>
  </header>

  <main class="app-main">
    <div class="content-layout">
      <div class="forms-section">
        <PhoneStatusForm />
        <ChatRoomForm />
        <MessageForm />
        <MessageList />
        <div class="card actions">
          <div class="action-buttons">
            <button @click="exportData" class="btn">데이터 내보내기 (JSON)</button>
            <button @click="resetAll" class="btn btn-secondary">전체 초기화</button>
          </div>
        </div>
        <div class="card preview">
          <div class="preview-header">
            <h3>JSON 데이터</h3>
            <div class="preview-actions">
              <button @click="copyData" class="btn btn-small">복사하기</button>
              <button @click="clearStorage" class="btn btn-small btn-danger">대화 초기화</button>
            </div>
          </div>
          <pre class="data-preview">{{ JSON.stringify(previewData, null, 2) }}</pre>
        </div>
      </div>
      <div class="preview-section">
        <KakaoPreview />
      </div>
    </div>
  </main>
</template>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
  background: linear-gradient(135deg, #fee500 0%, #fdd835 100%);
  border-radius: 15px;
  margin-bottom: 30px;
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  color: #3c1e1e;
}

.app-header p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.app-main {
  max-width: 100%;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

.forms-section {
  display: flex;
  flex-direction: column;
}

.preview-section {
  position: sticky;
  top: 20px;
}

.actions {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.preview {
  background: #f8f9fa;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.preview-header h3 {
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.data-preview {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  padding: 15px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  max-width: 690px;
}

@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .preview-section {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
