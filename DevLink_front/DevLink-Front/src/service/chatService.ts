import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export const connectStomp = (
  roomId: number,
  onMessage: (message: any) => void,
  token?: string | null
) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    onConnect: () => {
      console.log('STOMP 연결 성공')
      stompClient?.subscribe(`/topic/chat/${roomId}`, (frame) => {
        console.log('수신 메시지:', frame.body)
        const message = JSON.parse(frame.body)
        onMessage(message)
      })
    },
    onDisconnect: () => {
      console.log('STOMP 연결 끊김 - 자동 재연결 시도 중...')
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame)
    },
  })
  stompClient.activate()
}

export const disconnectStomp = () => {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
}

export const sendMessage = (roomId: number, content: string) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: `/app/chat/${roomId}`,
      headers: {
        'content-type': 'text/plain',
      },
      body: content,
    })
  } else {
    console.warn('STOMP 연결이 없습니다. 메시지 전송 실패')
  }
}