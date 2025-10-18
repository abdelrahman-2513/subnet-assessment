import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrls: ['../../../../app.css']
})
export class RegisterComponent {
  RegisterForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.RegisterForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.RegisterForm.invalid) return;

    this.isLoading = true;
    this.auth.register(this.RegisterForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);

        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Registration failed';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
