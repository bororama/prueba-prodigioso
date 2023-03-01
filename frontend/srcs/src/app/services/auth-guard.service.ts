import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

constructor(private router : Router, private authService : AuthService) { }

canActivate(): Observable<boolean> {
  return this.authService.credentialsAreValid()
  .pipe(catchError( ( error ) : any => {
    console.log('Invalid credentials', error)
    this.router.navigate(['/sign-in']);
    return of(false);
  })
  , map((authorized) => {
    if (authorized){
      return true;
    }
    return false;
   }))
}

}
