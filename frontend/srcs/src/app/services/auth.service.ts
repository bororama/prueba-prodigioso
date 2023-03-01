import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private http : HttpClient) { }
  credentialsAreValid() : Observable<string>{
    return this.http.post('/api/valid-auth', {}, {withCredentials: true, responseType: 'text'});
  }

  credentialsExist() : Observable<string> {
    return this.http.get('/api/check-auth', {withCredentials: true, responseType: 'text'})
  }

  deleteCredentials() {
    this.http.delete('/api/delete-auth', {withCredentials: true});
  }
}
