import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component'
import { HomeComponent } from './home/home.component'


const routes: Routes = [
  { path: 'sign-in', component : SignInComponent},
  { path: 'home', component : HomeComponent},
  { path: '', redirectTo: '/sign-in', pathMatch : 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
