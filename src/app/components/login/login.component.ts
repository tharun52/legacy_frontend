import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.username || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.username, this.password).subscribe(
      () => this.router.navigate(['/']),
      err => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    );
  }
}
