import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  // SharedModule trae CommonModule, ReactiveFormsModule y RouterModule
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
