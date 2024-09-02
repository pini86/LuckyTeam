/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { IError } from '../../shared/models/sign';
import { AuthService } from '../../shared/services/auth.service';
import { emailCustomValidator } from '../../shared/validators/email-custom-validator.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _auth = inject(AuthService);

  public form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, emailCustomValidator()]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  protected readonly _isError = signal<IError>(null);
  public readonly isLoading = signal<boolean>(false);

  public disableSignUpButton = true;

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this._isError.set(null);
      if (this.form.invalid || this.form.controls.password.value !== this.form.controls.repeatPassword.value) {
        this.disableSignUpButton = true;
      } else {
        this.disableSignUpButton = false;
      }
    });
  }

  ngOnInit(): void {
    if (this._auth.isLogged()) {
      this._router.navigate(['']);
    }
  }

  public register(): void {
    if (this.form.invalid) {
      return;
    }

    this.disableSignUpButton = true;
    this.isLoading.set(true);
    this._http
      .post('/api/signup', { email: this.form.value.email, password: this.form.value.password })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: () => {
          this._router.navigate(['signin']); // адрес куда переходим после успешной регистрации Sign In page
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }

  public signIn(): void {
    this._router.navigate(['signin']);
  }
}
