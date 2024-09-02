import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';
import { IError } from '../../../shared/models/sign';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-user-profile-change-password',
  templateUrl: './user-profile-change-password.component.html',
  styleUrl: './user-profile-change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressBar,
  ],
})
export class UserProfileChangePasswordComponent {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  public password = new FormControl<string>('', [Validators.required, Validators.minLength(8)]);

  protected readonly _isError = signal<IError>(null);
  public readonly isLoading = signal<boolean>(false);

  constructor(private _dialogRef: MatDialogRef<UserProfileChangePasswordComponent>) {
    this.password.statusChanges.subscribe(() => {
      this._isError.set(null);
    });
  }

  public save(): void {
    if (this.password.invalid) {
      return;
    }

    this.isLoading.set(true);
    this._http
      .put(
        '/api/profile/password',
        { password: this.password.value },
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
        next: () => {
          this._dialogRef.close();
        },
        error: (error) => {
          this._isError.set(error.error);
        },
      });
  }
}
