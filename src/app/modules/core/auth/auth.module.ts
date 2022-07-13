import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { SendresetpasswordComponent } from './sendresetpassword/sendresetpassword.component';
import { MADDirectivesModule } from '../../_directives/maddirectives.module';
import { MADPipesModule } from '../../pipes/madpipes.module';

@NgModule({
  declarations: [
    LoginComponent,
    ForgetPassComponent,
    SendresetpasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    MADDirectivesModule,
    MADPipesModule,
  ],
})
export class AuthModule {}
