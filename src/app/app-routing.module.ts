import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard, authGuard2 } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent, canActivate: [authGuard2] },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'chat', loadChildren: () => import('./components/chat/chat.module').then(m => m.ChatModule), canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
