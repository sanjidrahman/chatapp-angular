import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  isAuthenticated() {

  }

  login(value: {email: string, password: string}) {
    return this.http.post('http://localhost:3000/login', value)
  }

  users() {
    return this.http.get('http://localhost:3000/user')
  }
}
