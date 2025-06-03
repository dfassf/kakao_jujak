import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import {
  type KakaoTalkData,
  type Message,
  type PhoneStatus,
  type ChatRoomInfo,
  type UISettings,
  MessageStatus,
} from '@/types'

const STORAGE_KEY = 'kakaotalk-data'

export const useKakaoStore = defineStore('kakao', () => {
  const phoneStatus = reactive<PhoneStatus>({
    time: '2:30',
    battery: 85,
    signalLevel: 4,
    wifiLevel: 3,
  })

  const chatRoomInfo = reactive<ChatRoomInfo>({
    title: '홍길동',
    otherUserName: '홍길동',
    otherUserProfile: '',
    notice: '',
    noticeVisible: false,
    unreadMessages: 0,
    showFirstDateChip: true,
  })

  const uiSettings = reactive<UISettings>({
    messageBackgroundColor: '#B2C7DA',
  })
  const typingText = ref('')
  const messageList = ref<Message[]>([])

  const loadFromStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const data = JSON.parse(savedData) as KakaoTalkData
        Object.assign(phoneStatus, data.phoneStatus)
        Object.assign(chatRoomInfo, data.chatRoomInfo)
        Object.assign(uiSettings, data.uiSettings)
        messageList.value = data.messages
      }
    } catch (error) {
      console.error('로컬스토리지 데이터 로드 실패:', error)
    }
  }

  const saveToStorage = () => {
    try {
      const data = getKakaoData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('로컬스토리지 저장 실패:', error)
    }
  }

  loadFromStorage()

  watch(
    [phoneStatus, chatRoomInfo, uiSettings, messageList],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      status: message.status ?? MessageStatus.SENT,
    }
    messageList.value.push(newMessage)
  }

  const removeMessage = (id: string) => {
    const index = messageList.value.findIndex((msg) => msg.id === id)
    if (index > -1) messageList.value.splice(index, 1)
  }

  const updateMessage = (id: string, updates: Partial<Message>) => {
    const message = messageList.value.find((msg) => msg.id === id)
    if (message) Object.assign(message, updates)
  }

  const getKakaoData = (): KakaoTalkData => ({
    phoneStatus: { ...phoneStatus },
    chatRoomInfo: { ...chatRoomInfo },
    uiSettings: { ...uiSettings },
    messages: [...messageList.value],
  })

  const resetData = () => {
    phoneStatus.time = '2:30'
    phoneStatus.battery = 85
    phoneStatus.signalLevel = 4
    phoneStatus.wifiLevel = 3
    chatRoomInfo.title = '홍길동'
    chatRoomInfo.otherUserName = '홍길동'
    chatRoomInfo.otherUserProfile = ''
    chatRoomInfo.notice = ''
    chatRoomInfo.noticeVisible = false
    chatRoomInfo.unreadMessages = 0
    chatRoomInfo.showFirstDateChip = true
    uiSettings.messageBackgroundColor = '#B2C7DA'
    messageList.value = []
    typingText.value = ''

    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    phoneStatus,
    chatRoomInfo,
    uiSettings,
    messageList,
    typingText,
    addMessage,
    removeMessage,
    updateMessage,
    getKakaoData,
    resetData,
  }
})
