import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(
    private _auth: AuthService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token')
    if (token) {
      let newRequest = request.clone({
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token,
        })
      })
      return next.handle(newRequest).pipe(
        // tap(event => {
        //   if (event instanceof HttpErrorResponse) {
        //     console.log(event);
        //     this._auth.handleError(event)
        //   }
        // }),
        catchError((err: HttpErrorResponse) => {
          this._auth.handleError(err)
          return throwError(err);
        })
      )
    }
    let newRequest = request.clone({})
    return next.handle(newRequest);
  }
}
