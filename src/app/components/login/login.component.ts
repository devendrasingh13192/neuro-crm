import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, Form, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //private fb = inject(FormBuilder);

  //Using signal for state
  isLoading = signal(false);
  errorMessage = signal('');
  isLoginMode = signal(true);
  authService = inject(AuthService);
  private router = inject(Router);

  // Reactive form setup

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required)
  },
    // (control: AbstractControl) => 
    // control.get('password')?.value === control.get('confirmPassword')?.value 
    //   ? null 
    //   : { mismatch: true }
  )

  get isFormValid(): boolean {
    const basicValid = this.loginForm.get('email')?.valid &&
      this.loginForm.get('password')?.valid;

    if (this.isLoginMode()) {
      return !!basicValid;
    } else {
      return !!basicValid && this.passwordsMatch;
    }
  }

  get passwordsMatch(): boolean {
    return this.loginForm.value.password === this.loginForm.value.confirmPassword;
  }



  async onSubmit(): Promise<void> {
    if (this.isFormValid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      const credentials = this.loginForm.value as { email: string; password: string };
      if (!this.isLoginMode()) {
         await this.authenticate(this.authService.register(credentials));
      }else{
         await this.authenticate(this.authService.login(credentials));
      }
    }
  }

  async isLogInMode(): Promise<void> {
    this.isLoginMode.set(!this.isLoginMode());
    this.loginForm.reset();
  }

  private async authenticate(authObservable: any): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const response = await authObservable.toPromise();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(error.message);
      //this.loginForm.reset();
    } finally {
      this.isLoading.set(false);
    }
  }

}
