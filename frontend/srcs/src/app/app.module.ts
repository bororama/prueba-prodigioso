import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptorService } from './services/htpp-interceptor.service'; 
import { AuthService } from './services/auth.service';
import { GoogleSsoComponent } from './components/google-sso/google-sso.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [			
    AppComponent,
      GoogleSsoComponent,
      SignInComponent,
      HomeComponent,
      NotFoundComponent
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
   },
   CookieService,
   AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
