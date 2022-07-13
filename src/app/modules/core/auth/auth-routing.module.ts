import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { CommonModule } from '@angular/common';
import { SendresetpasswordComponent } from './sendresetpassword/sendresetpassword.component';

const routes: Routes = [
  { path: '', component: LoginComponent, data: { animation: 'login' } },
  {
    path: 'forget',
    component: SendresetpasswordComponent,
    data: { animation: 'forget' },
  },
  {
    path: 'reset',
    component: ForgetPassComponent,
    data: { animation: 'forget' },
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
