import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly userName = signal<string>('');
  readonly token = signal<string>('');

  isAdmin(): boolean {
    return this.userName() === 'admin@admin.com';
  }

  logIn(username: string, token: string): void {
    localStorage.clear();
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    this.userName.set(username);
    this.token.set(token);
  }

  logOut(): void {
    localStorage.clear();
    this.userName.set('');
    this.token.set('');
  }
}
