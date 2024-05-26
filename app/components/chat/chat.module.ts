import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat.routing.module';
import { ChatComponent } from './chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat/chat.service';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SharedModule } from '../../shared/shared.module';

const jwt_token = localStorage.getItem('token');
const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    auth: {
      token: jwt_token
    }
  }
};

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ChatRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    SharedModule
  ],
  providers: [
    AuthService,
    ChatService
  ]
})
export class ChatModule { }
