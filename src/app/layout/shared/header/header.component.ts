import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthManager } from '../../auth/auth-service-manager';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  /**
   *
   */
  constructor(private router: Router) {}

  headerHeight = '0';
  rotate = 'rotate(90deg)';
  private opened = false;

  toggleHeader() {
    this.opened = !this.opened;
    this.toggle();
  }

  public hide(event: Event) {
    if ((event.target as HTMLElement).classList.contains('arrow')) {
      return;
    }

    this.opened = false;
    this.toggle();
  }

  private toggle() {
    this.rotate = this.opened ? 'rotate(-90deg)' : 'rotate(90deg)';
    this.headerHeight = this.opened ? '84px' : '0';
  }

  public logout() {
    AuthManager.logout();
    this.router.navigate(['/registration']);
  }

  public get isAuthenticated() {
    return AuthManager.isAuthenticated;
  }

  public goToMain(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }
}
