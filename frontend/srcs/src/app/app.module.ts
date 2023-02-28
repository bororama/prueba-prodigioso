import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptorService } from './http-interceptors/htpp-interceptor.service'; 
import { GoogleSsoComponent } from './google-sso/google-sso.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [			
    AppComponent,
      GoogleSsoComponent,
      SignInComponent,
      HomeComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
   {
     provide: HTTP_INTERCEPTORS, 
     useClass: HttpInterceptorService, 
     multi : true,
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
