import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });
  }

  sendMessage(user: string | null, message: string | undefined, room: string | null): void {
    const data = { user, message, room };
    this.socket.emit('message', data);
  }

  sendServerMessage(room: string, message: string): void {
    const data = { room, message };
    this.socket.emit('message', data);
  }

  getMessages(): Observable<{ userId: string, message: string, room: string }> {
    return new Observable<{ userId: string, message: string, room: string }>(observer => {
      this.socket.on('message', (data: { userId: string, message: string, room: string }) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  requestLastMessages(room: string, count: number): void {
    this.socket.emit('request-last-messages', { room, count });
  }


  getRooms(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.socket.on('rooms', (rooms: string[]) => {
        observer.next(rooms);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  joinRoom(roomId: string, userId: string): void {
    this.socket.emit('join-room', roomId, userId);
  }

  leaveRoom(): void {
    this.socket.emit('leave-room');
  }

  requestRooms(): void {
    this.socket.emit('request-rooms');
  }
}
