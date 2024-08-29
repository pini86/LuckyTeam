import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
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
export class RegistrationComponent {
  public form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, emailCustomValidator()]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });
  protected readonly _isError = signal<IError>(null);
  public readonly isLoading = signal<boolean>(false);
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  public disableSignUpButton = true;

  public get password(): FormControl<string> {
    return this.form.controls.password;
  }

  public get repeatPassword(): FormControl<string> {
    return this.form.controls.repeatPassword;
  }

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this._isError.set(null);
      if (this.form.status === 'INVALID' || this.form.controls.password.value !== this.form.controls.repeatPassword.value) {
        this.disableSignUpButton = true;
      } else {
        this.disableSignUpButton = false;
      }
    });
  }

  public register(): void {
    if (this.form.status === 'INVALID') {
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
        takeUntilDestroyed(this.#destroyRef),
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
