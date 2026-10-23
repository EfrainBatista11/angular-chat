import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../models/message';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-chat',
  templateUrl: 'chat.html',
})
export class Chat implements OnInit {

  client!: Stomp.Client;
  connected: boolean = false;

  messages: Message[] = [];
  message: Message = new Message();

  ngOnInit(): void {
    this.client = new Stomp.Client({
      brokerURL: undefined,
      webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
      debug: str => console.log(str),
      reconnectDelay: 5000
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log(`Conectados: ${this.client.connected} : ${frame}`);

      this.client.subscribe('/chat/message', e => {
        console.log(e.body);
      });
    }

    this.client.onDisconnect = (frame) => {
      this.connected = false;
      console.log(`Desconectados: ${!this.client.connected} : ${frame}`)
    }

    this.connect();
  }

  connect(): void {
    this.client.activate();
    this.connected = true;
  }

  deconnect(): void {
    this.client.deactivate();
    this.connected = false;
  }

  onSendMessage() {
    this.client.publish({
      destination: '/app/message',
      body: JSON.stringify(this.message)
    });
    this.message.text = '';
  }
}
