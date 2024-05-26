import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'chat', loadChildren: () => import('./components/chat/chat.module').then(m => m.ChatModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
