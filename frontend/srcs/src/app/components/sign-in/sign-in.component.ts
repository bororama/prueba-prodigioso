import { Component, OnInit } from '@angular/core';
import { GoogleSsoComponent } from '../google-sso/google-sso.component';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, map, catchError } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit() {

    this.authService.credentialsExist().subscribe( (exist) => {
      console.log('exist: ', exist);
      if (exist === 'true') {
        this.authService.credentialsAreValid().subscribe((valid) => { 
          console.log('valid?', valid);
          if (valid === 'true') {
            this.router.navigate(['/home'])
          }
          else {
            this.authService.deleteCredentials();
          }
        });
      }
    })
  }
}

