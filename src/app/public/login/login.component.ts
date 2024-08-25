import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

interface IResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public form = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>({ value: '', disabled: true }, Validators.required),
  });
  protected readonly _isError = signal<string>('');
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _auth = inject(AuthService);

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this._isError.set('');
      if (this.form.controls.email.invalid && this.form.controls.password.enabled) {
        this.form.controls.password.disable();
      } else if (this.form.controls.email.valid && this.form.controls.password.disabled) {
        this.form.controls.password.enable();
      }
    });
  }

  public saveForm(): void {
    if (this.form.status === 'INVALID') {
      return;
    }
    this._http.post('/api/signin', { email: this.form.value.email, password: this.form.value.password }).subscribe({
      next: (value) => {
        this._auth.logIn(this.form.value.email, (value as IResponse)['token']);

        this._router.navigate(['']); // адрес куда переходим после успешной авторизации
      },
      error: (error) => {
        this._isError.set(error.error.message);
      },
    });
  }

  public signup(): void {
    //это тестовый запрос для образца использования токена
    this._http
      .get('/api/station', {
        headers: {
          Authorization: `Bearer ${this._auth.token()}`,
        },
      })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => console.log(error),
      });
  }

  public admin(): void {
    this._http.post('/api/signin', { email: 'admin@admin.com', password: 'my-password' }).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => console.log(error),
    });
  }
}
