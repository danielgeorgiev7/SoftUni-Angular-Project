import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  signupSub: Subscription = new Subscription();
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    const { username, email, password, rePassword } = form.form.value;
    if (form.invalid) return;
    if (password !== rePassword) return;
    form.reset();
    this.isLoading = true;
    this.authService
      .signUp(email, password, username)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        form.reset();
        console.error('Error signing up:', error);
      });
  }

  ngOnDestroy(): void {
    this.signupSub.unsubscribe();
  }
}
