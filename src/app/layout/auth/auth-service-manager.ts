import { Injectable } from '@angular/core';
// import { UsersService } from '../services/users.service';
// import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  // public static userID: string;
  private static token: string | null = '';

  public static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jwt_token');
    }

    return this.token;
  }

  public static logout() {
    this.token = '';
    localStorage.removeItem('jwt_token');
  }

  constructor() {}

  public static isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Распарсите токен и проверьте его срок действия
      const tokenData = this.parseJwt(token);
      const expirationDate = new Date(tokenData.exp * 1000); // Преобразуйте секунды в миллисекунды

      // Сравниваем текущую дату с датой истечения токена
      if (expirationDate > new Date()) {
        // Токен действителен
        return true;
      }
    }
    // Токен отсутствует или истек
    return false;
  }

  private static parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64));
    return JSON.parse(jsonPayload);
  }

  //   public static GetMyId(): string | null {
  //     const token = this.getAccessToken();

  //     if (token && token !== "undefined") {
  //       var decoded = jwt_decode(this.getAccessToken()!) as any;
  //       return decoded.sub;
  //     }

  //     return null;
  //   }

  public static saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
    this.token = token;
  }

  // public static isAuthenticated(): boolean {
  //   const token = localStorage.getItem('access_token');
  //   if (!token || token === 'undefined') {
  //     return false;
  //   }
  //   return true;
  // }

  //   public static isAdmin(): boolean {
  //     let token = this.getAccessToken();
  //     if (!token) {
  //       return false;
  //     }
  //     var decoded = jwt_decode(this.getAccessToken()!) as any;
  //     return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes('Admin');
  //   }

  private getInfo(info: string) {}

  public static unAuthenticate(): void {
    // AuthManager.authenticated = false;
    // localStorage.removeItem("access_token");
  }

  public static setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public static setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  public static getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public authenticate(): void {
    // const url = this.config.getAuthUrl();
    // window.location.replace(url);
  }

  public static signOut(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // AuthManager.authenticated = false;
  }

  //   public static async tryRefreshingTokens(token: string, userService: UsersService): Promise<boolean> {
  //     const refreshToken = localStorage.getItem("refresh_token");

  //     if (!token || !refreshToken) {
  //       return false;
  //     }

  //     let isRefreshSuccess: boolean;

  //     const response = await userService.refreshTokenAsync(token!, refreshToken!);

  //     if (!response.token || !response.refreshToken) {
  //       isRefreshSuccess = false;
  //     }

  //     localStorage.setItem("access_token", response.token);
  //     localStorage.setItem("refresh_token", response.refreshToken);

  //     isRefreshSuccess = true;
  //     return isRefreshSuccess;
  //   }
}
