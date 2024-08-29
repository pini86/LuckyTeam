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
import { IError, IResponse } from '../../shared/models/sign';
import { AuthService } from '../../shared/services/auth.service';
import { emailCustomValidator } from '../../shared/validators/email-custom-validator.component';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, emailCustomValidator()]),
    password: new FormControl<string>('', Validators.required),
  });
  protected readonly _isError = signal<IError>(null);
  public readonly isLoading = signal<boolean>(false);
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _auth = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);

  public disableSignInButton = true;

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this._isError.set(null);
      if (this.form.status === 'INVALID') {
        this.disableSignInButton = true;
      } else {
        this.disableSignInButton = false;
      }
    });
  }

  public signIn(): void {
    if (this.form.status === 'INVALID') {
      return;
    }
    this.disableSignInButton = true;
    this.isLoading.set(true);
    this._http
      .post('/api/signin', { email: this.form.value.email, password: this.form.value.password })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: (value) => {
          this._auth.logIn(this.form.value.email, (value as IResponse)['token']);

          this._router.navigate(['']); // адрес куда переходим после успешной авторизации Search page (default)
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }

  public signup(): void {
    this._router.navigate(['signup']);
  }
}
