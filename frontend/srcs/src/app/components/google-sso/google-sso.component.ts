import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-google-sso',
  templateUrl: './google-sso.component.html',
  styleUrls: ['./google-sso.component.css']
})

export class GoogleSsoComponent implements OnInit {

  constructor(private http: HttpClient) { 
  }
  
  handleCredentialResponse(response : any) {
    //e m p t y, but google likes it
  }

  
  async ngOnInit() {
    
    this.loadGoogle();
    
  }
  private loadGoogle() {
    const googleLibrary = document.createElement('script');
    
    googleLibrary.src = 'https://accounts.google.com/gsi/client';
    googleLibrary.onload =  () => {this.displayGoogleButton();}
    document.body.appendChild(googleLibrary);
  }
  
  /*
  **  The GET request first retrieves the app's client id.
  **  Upon completion, the google.accounts.id object is initialized and
  **  its login button is rendered inside the subscribe callback.
  **  'ux_mode : redirect' makes it so that handleCredentialResponse() is never called.
  **  Instead, a POST request to the endpoint specified in login_uri is made.
  **  Said request contains the corresponding credentials and are thus validated
  **  server side. After a successful validation of credentials, the server
  **  redirects the client to localhost:9778/home
  */
  private displayGoogleButton() {
    this.http.get<any>('/api/client_id', {observe: 'body'}).subscribe((value) => {
      //@ts-ignore
      google.accounts.id.initialize({
      client_id:  value.client_id,
      callback: this.handleCredentialResponse,  
      ux_mode: "redirect",
      login_uri: "http://localhost:3000/api/login"
      })
      //@ts-ignore
      google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "filled_black", size: "large", shape: "pill"}
      );
    });
  }
}
  


