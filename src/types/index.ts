// 메시지 타입
export interface Message {
  id: string
  sender: SentPerson
  content: string
  time: string | Date
  isRead: boolean
  status?: MessageStatus
}

export interface PhoneStatus {
  time: string
  battery: number
  signalLevel: number
  wifiLevel: number | 'LTE' | '5G'
}

export interface ChatRoomInfo {
  title: string
  otherUserName: string
  otherUserProfile: string
  notice?: string
  noticeVisible: boolean
  unreadMessages: number
  showFirstDateChip: boolean
}

export interface UISettings {
  messageBackgroundColor: string
}

export interface KakaoTalkData {
  phoneStatus: PhoneStatus
  chatRoomInfo: ChatRoomInfo
  uiSettings: UISettings
  messages: Message[]
}

export enum SentPerson {
  ME = 'me',
  OTHER = 'other',
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
}

export const getMessageStatusText = (status: MessageStatus) => {
  switch (status) {
    case MessageStatus.SENDING:
      return '전송중'
    case MessageStatus.SENT:
      return '전송 성공'
    case MessageStatus.FAILED:
      return '전송 실패'
  }
}
