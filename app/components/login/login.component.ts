import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, whiteSpaceValidator } from '../../shared/validators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  subscribe = new Subscription()

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _chat: ChatService,
    private _router: Router,
    private _snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, emailValidator(), whiteSpaceValidator()]],
      password: ['', [Validators.required, whiteSpaceValidator()]]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return
    } else {
      this.subscribe.add(
        this._auth.login(this.loginForm.value).subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token)
            this._router.navigate(['/chat'])
            this._chat.reconfigureSocketConnection(res.token)
          },
          error: (err) => {
            this.openErrorSnackBar(err.error.message ? err.error.message : err.message)
          }
        })
      )
    }
  }

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
