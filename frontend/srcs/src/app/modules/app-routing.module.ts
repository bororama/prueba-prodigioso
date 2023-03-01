import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../components/sign-in/sign-in.component'
import { HomeComponent } from '../components/home/home.component'
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { AuthGuardService } from '../services/auth-guard.service';


const routes: Routes = [
  { path: 'sign-in', component : SignInComponent},
  { path: 'home', component : HomeComponent, canActivate : [AuthGuardService]},
  { path: '', redirectTo: '/sign-in', pathMatch : 'full'},
  { path: '**', component : NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
