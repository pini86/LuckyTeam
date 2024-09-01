/* eslint-disable rxjs/no-ignored-observable */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { IError, IResponseUser } from '../../shared/models/sign';
import { AuthService } from '../../shared/services/auth.service';
import { emailCustomValidator } from '../../shared/validators/email-custom-validator.component';
import { UserProfileChangePasswordComponent } from './user-profile-change-password/user-profile-change-password.component';

@Component({
  selector: 'app-user-profile',
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
    UserProfileChangePasswordComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _auth = inject(AuthService);
  private readonly _dialog = inject(MatDialog);

  public editEmail = signal(true);
  public editName = signal(true);
  protected readonly _isError = signal<IError>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly password = signal<string>('');
  public readonly isAdmin = computed(this._auth.isAdmin);

  public form = new FormGroup({
    email: new FormControl<string>({ value: '', disabled: true }, [Validators.required, emailCustomValidator()]),
    name: new FormControl<string>({ value: '', disabled: true }),
  });

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this._isError.set(null);
    });
  }

  ngOnInit(): void {
    if (!this._auth.isLogged()) {
      this._router.navigate(['']);
    }
    this._getUser();
  }

  public clickEventEmail(event: MouseEvent): void {
    if (this.editEmail()) {
      this.editEmail.set(false);
      event.stopPropagation();
      this.form.controls.email.enable();
    } else {
      this._saveUser();
    }
  }

  public clickEventName(event: MouseEvent): void {
    if (this.editName()) {
      this.editName.set(false);
      event.stopPropagation();
      this.form.controls.name.enable();
    } else {
      this._saveUser();
    }
  }

  public changePassword(): void {
    this._dialog
      .open(UserProfileChangePasswordComponent, {
        width: '450px',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  public logout(): void {
    this.isLoading.set(true);
    this._http
      .delete('/api/logout', {
        headers: {
          Authorization: `Bearer ${this._auth.token()}`,
        },
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: () => {
          this._auth.logOut();
          this._router.navigate(['']);
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }

  private _getUser(): void {
    this.isLoading.set(true);
    this._http
      .get('/api/profile', {
        headers: {
          Authorization: `Bearer ${this._auth.token()}`,
        },
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: (response) => {
          const { email, name } = response as IResponseUser;
          this.form.reset({ email, name });
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }
  private _saveUser(): void {
    if (this.form.invalid || !this.form.dirty) {
      this._afterResetForm();
      return;
    }

    this.isLoading.set(true);
    this._http
      .put(
        '/api/profile',
        { email: this.form.controls.email.value, name: this.form.controls.name.value || '' },
        {
          headers: {
            Authorization: `Bearer ${this._auth.token()}`,
          },
        },
      )
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: (response) => {
          const { email, name } = response as IResponseUser;
          this.form.reset({ email, name });
          this._afterResetForm();
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }

  private _afterResetForm(): void {
    this.form.disable();
    this.editEmail.set(true);
    this.editName.set(true);
  }
}
