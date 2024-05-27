import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private _http: HttpClient,
    private _socket: Socket,
  ) { }

  commonUrl = environment.API_URL

  reconfigureSocketConnection(token: string) {
    this._socket.ioSocket.auth = { token };
    this._socket.ioSocket.connect();
  }

  sendPrivateMessage(data: { recipientId: string, message: string }): void {
    this._socket.emit('privateMessage', data);
  }

  fetchMessages(senderId: string, recipientId: string, isPrivate: boolean): Observable<any[]> {
    this._socket.emit('fetchMessages', { senderId, recipientId, isPrivate });
    return this._socket.fromEvent<any[]>('messageHistory');
  }

  fetchGroupMessages(isPrivate: boolean) {
    this._socket.emit('fetchGroupMessages', { isPrivate })
    return this._socket.fromEvent<any[]>('messageHistory');
  }

  onPrivateMessage(): Observable<{ message?: string, senderId: string, createdAt: string, fileUrl?: string }> {
    return this._socket.fromEvent('privateMessage');
  }

  uploadFile(formData: FormData): Observable<any> {
    return this._http.post(`${this.commonUrl}/api/upload`, formData); // Update the URL to your backend API
  }

  joinGroup(group: string) {
    this._socket.emit('joinGroup', group);
  }

  leaveGroup(group: string) {
    this._socket.emit('leaveGroup', group);
  }

  sendGroupMessage(data: { group: string, message: string }) {
    this._socket.emit('groupMessage', data);
  }

  onGroupMessage() {
    return this._socket.fromEvent('groupMessage');
  }

  onUserConnected(): Observable<{ message: string }> {
    return this._socket.fromEvent('userConnected');
  }

  onUserDisconnected(): Observable<{ message: string }>{
    return this._socket.fromEvent('userDisconnected');
  }

}
