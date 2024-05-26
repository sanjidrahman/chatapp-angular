import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  users!: any[]
  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  senderId: any
  subscribe = new Subscription()

  constructor(
    private _auth: AuthService,
    private _chat: ChatService,
    private _snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded: any = jwtDecode(token)
      console.log(decoded);
      this.senderId = decoded.payload.id
    }
    this.subscribe.add(
      this._auth.users().subscribe({
        next: (res: any) => {
          this.users = res.filter((user: any) => user._id !== this.senderId);
        },
        error: (err) => {
          this.openErrorSnackBar(`Something went wrong, Please try again later \n ${err.message}`)
        }
      },
      )
    );

    this.subscribe.add(
      this._chat.onPrivateMessage().subscribe((message: any) => {
        if (message.senderId === this.selectedUser._id || message.senderId === this.senderId) {
          this.messages.push(message);
        }
      })
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this._chat.fetchMessages(this.senderId, user._id, true).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = this.newMessage.trim();
      const data = {
        recipientId: this.selectedUser._id,
        message
      };
      this._chat.sendPrivateMessage(data)
      this.newMessage = '';
    }
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('senderId', this.senderId);
      formData.append('recipientId', this.selectedUser._id);

      this._chat.uploadFile(formData).subscribe({
        next: (res) => {
          this.messages.push({
            text: `File uploaded: ${res.fileName}`,
            fileUrl: res.fileUrl,
          });
        },
        error: (err: { message: any; }) => {
          this.openErrorSnackBar(`File upload failed: ${err.message}`);
        }
      });
    }
  }

  // snack bar function
  openErrorSnackBar(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe()
  }

}
