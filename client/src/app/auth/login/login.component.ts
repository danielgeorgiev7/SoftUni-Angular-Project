import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  loginSub: Subscription = new Subscription();
  isLoading: boolean = false; // add loading
  error: string = ''; // add error displaying
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    const { email, password } = form.form.value;
    if (form.invalid) return;
    form.reset(); // add specific reset
    this.isLoading = true;

    this.authService
      .signIn(email, password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        form.reset();
        console.error('Error signing in:', error);
      });
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
