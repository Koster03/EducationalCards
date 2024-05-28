import { Component, OnInit, inject } from '@angular/core';
import { AuthManager } from './layout/auth/auth-service-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'EduCards';

  private router = inject(Router);

  ngOnInit() {
    // Проверяем наличие и валидность токена
    if (AuthManager.isAuthenticated()) {
      console.log('NICE');
      
      // Пользователь авторизован, выполните необходимые действия
    } else {
      // Перенаправляем на страницу входа
      this.router.navigate(['/registration']); // Если используете Angular Router
    }
  }
}
