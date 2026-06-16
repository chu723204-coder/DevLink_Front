import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export const connectStomp = (
  roomId: number,
  onMessage: (message: any) => void
) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient?.subscribe(`/topic/chat/${roomId}`, (frame) => {
        console.log('수신 메시지:', frame.body)
        const message = JSON.parse(frame.body)
        onMessage(message)
      })
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
  }
}