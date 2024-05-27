import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _snackbar: MatSnackBar,
  ) { }

  commonUrl = environment.API_URL

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  login(value: { email: string, password: string }) {
    return this._http.post(`${this.commonUrl}/login`, value)
  }

  users() {
    return this._http.get(`${this.commonUrl}/user`)
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  handleError(err: HttpErrorResponse) {
    let errMsg: string
    if (err.error instanceof ErrorEvent) {
      errMsg = `${err.error.message}`
    } else {
      switch (err.status) {
        case 400:
          errMsg = `${err.status} Bad Request`;
          break;
        case 401:
          errMsg = `${err.status} Unauthorized`;
          break;
        case 403:
          errMsg = `${err.status} Forbidden`;
          break;
        case 404:
          errMsg = `${err.status} Not Found`;
          break;
        case 408:
          errMsg = `${err.status} Request Timeout`;
          break;
        case 500:
          errMsg = `${err.status} Internal Server Error`;
          break;
        case 502:
          errMsg = `${err.status} Bad Gateway`;
          break;
        case 503:
          errMsg = `${err.status} Service Unavailable`;
          break;
        case 504:
          errMsg = `${err.status} Gateway Timeout`;
          break;
        default:
          errMsg = `Something went wrong`;
          break;
      }
    }
    this.openErrorSnackBar(errMsg)
  }

  openErrorSnackBar(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}
