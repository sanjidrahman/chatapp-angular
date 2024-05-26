import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private _http: HttpClient,
    private _socket: Socket,
  ) { }

  joinGroup(group: string): void {
    this._socket.emit('joinGroup', group);
  }

  sendPrivateMessage(data: { recipientId: string, message: string }): void {
    this._socket.emit('privateMessage', data);
  }

  fetchMessages(senderId: string, recipientId: string, isPrivate: boolean): Observable<any[]> {
    this._socket.emit('fetchMessages', { senderId, recipientId, isPrivate });
    return this._socket.fromEvent<any[]>('messageHistory');
  }

  onPrivateMessage(): Observable<{ message?: string, senderId: string, createdAt: string, fileUrl?: string}> {
    return this._socket.fromEvent('privateMessage');
  }

  uploadFile(formData: FormData): Observable<any> {
    return this._http.post('http://localhost:3000/api/upload', formData); // Update the URL to your backend API
  }

}
