import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly userName = signal<string>('');
  public readonly token = signal<string>('');
  public readonly isAdmin = computed(() => (this.userName() === 'admin@admin.com' ? true : false));
  public readonly isLogged = computed(() => this.userName().length > 0 && this.token().length > 0);

  public logIn(username: string, token: string): void {
    localStorage.clear();
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    this.userName.set(username);
    this.token.set(token);
  }

  public getToken(): string {
    return this.token();
  }

  public logOut(): void {
    localStorage.clear();
    this.userName.set('');
    this.token.set('');
  }
}
