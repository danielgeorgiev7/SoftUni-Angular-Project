import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    const { email, password, rePassword } = form.form.value;
    if (form.invalid) return;
    if (password !== rePassword) return;
    form.reset();
    this.isLoading = true;
    this.signupSub = this.authService
      .signup(email, password)
      .subscribe((resData) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    this.signupSub.unsubscribe();
  }
}
