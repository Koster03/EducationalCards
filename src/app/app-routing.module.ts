import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './layout/auth/register/register.component';
import { MainComponent } from './layout/main/main.component';

const routes: Routes = [
  { path: 'main', component: MainComponent},
  // { path: "login", component: LoginComponent },
  { path: "registration", component: RegisterComponent },
  { path: "**", redirectTo: 'main'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
