import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  currentGroup!: string | null
  groupUsers!: any[]
  users!: any[]
  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  senderId!: string
  loadingMessages: boolean = false;
  subscribe = new Subscription()

  constructor(
    private _auth: AuthService,
    private _chat: ChatService,
    private _snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // current user token
    const token = localStorage.getItem('token')
    if (token) {
      const decoded: any = jwtDecode(token)
      this.senderId = decoded.payload.id
    }

    // getting all users list
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

    // updating private message list on new message (latest)
    this.subscribe.add(
      this._chat.onPrivateMessage().subscribe((message) => {
        this.messages.push(message);
      })
    );

    // updating group message list on new message (latest)
    this.subscribe.add(
      this._chat.onGroupMessage().subscribe((message) => {
        this.messages.push(message)
      })
    )

    this.subscribe.add(
      this._chat.onUserConnected().subscribe(data => {
        this.openSuccessSnackBar(data.message)
      })
    )

    this.subscribe.add(
      this._chat.onUserDisconnected().subscribe(data => {
        this.openSuccessSnackBar(data.message)
      })
    )
  }

  joinGroup() {
    this.currentGroup = 'main';
    this._chat.joinGroup('main');
  }

  leaveGroup() {
    if (this.currentGroup) {
      this._chat.leaveGroup('main');
      this.currentGroup = null;
    }
  }

  selectGroup() {
    this.joinGroup()
    this.selectedUser = null;
    this.loadingMessages = true;
    this._chat.fetchGroupMessages(false).subscribe(messages => {
      this.messages = messages
      this.loadingMessages = false
    })
  }

  selectUser(user: any): void {
    this.loadingMessages = true;
    this.leaveGroup()
    this.selectedUser = user;
    this._chat.fetchMessages(this.senderId, user._id, true).subscribe(messages => {

      this.messages = messages;
      this.loadingMessages = false
    });
  }

  // handling sending messages (private and group)
  sendMessage(): void {
    if (!this.selectedUser) {
      if (this.newMessage.trim()) {
        const message = this.newMessage.trim();
        const data = {
          group: 'main',
          message
        };
        this._chat.sendGroupMessage(data)
        this.newMessage = '';
      }
    } else {
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
  }

  // handle file upload (private and group)
  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (this.currentGroup && !this.selectedUser) {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('senderId', this.senderId);
        formData.append('group', this.currentGroup);

        this._chat.uploadFile(formData).subscribe({
          next: (res) => {
            this.openSuccessSnackBar(res.message)
          },
          error: (err) => {
            this.openErrorSnackBar(`File upload failed: ${err.error.message ? err.error.message : err.message}`);
          }
        });
      }
    } else {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('senderId', this.senderId);
        formData.append('recipientId', this.selectedUser._id);

        this._chat.uploadFile(formData).subscribe({
          next: (res) => {
            this.openSuccessSnackBar(res.message)
          },
          error: (err) => {
            this.openErrorSnackBar(`File upload failed: ${err.error.message ? err.error.message : err.message}`);
          }
        });
      }
    }
  }

  loadImage(filename: string) {
    return `${environment.API_URL}/file/images/${filename}`
  }

  downloadFile(id: string) {
    return `${environment.API_URL}/api/files/${id}`
  }

  // function to check if message is self or not (for styling)
  isSelfMessage(message: any): boolean {
    const senderIdFromMessage = message.senderId._id || message.senderId;
    return senderIdFromMessage == this.senderId;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // You can customize the format as needed
  }

  logout() {
    this._auth.logout()
    this.openSuccessSnackBar('Logged out')
  }

  // snack bar function
  openErrorSnackBar(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  openSuccessSnackBar(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000, 
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  // -----------------------------

  ngOnDestroy(): void {
    this.subscribe.unsubscribe()
  }

}
