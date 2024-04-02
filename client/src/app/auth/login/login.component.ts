import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginSub: Subscription = new Subscription();
  isLoading: boolean = false;
  messages: Message[] = [];
  messagesSub: Subscription = new Subscription();

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageHandlerService: MessagesHandlerService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.isLoading = true;

    this.authService
      .signIn(email, password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.loginForm.get('password')?.setValue('');
        this.loginForm.get('password')?.markAsUntouched();
        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Logging Error:',
          detail: 'Incorrect email or password',
          life: 5000,
        });
      })
      .finally(() => (this.isLoading = false));
  }
}
