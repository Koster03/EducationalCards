import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthManager } from './auth-service-manager';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService) {}

  public register(info: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    return this.api.post('auth/register', info);
  }

  public async login(info: { email: string; password: string }): Promise<void> {
    const data = await this.api.post('auth/login', info);
    const token = data.token.split(' ')[1]; // Извлекаем токен
    console.log(data, token);
    AuthManager.saveToken(token);
  }
}
