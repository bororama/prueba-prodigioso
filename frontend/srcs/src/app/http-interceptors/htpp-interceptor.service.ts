import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler)  : Observable<HttpEvent<any>>{
    console.log(`Intercepting request to ${request.urlWithParams}`);
    if (request.url === '/api/client_id') {
      request =  request.clone({url : 'http://localhost:3000' + request.url});
    }
    return next.handle(request);
  }
constructor() { }

}

