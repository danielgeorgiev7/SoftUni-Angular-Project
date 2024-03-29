import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginSub: Subscription = new Subscription();
  isLoading: boolean = false;
  error: string = '';
  messages: Message[] = [];

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.messageService.messageObserver.subscribe((messages) => {
      if (Array.isArray(messages)) {
        this.messages = messages;
      } else {
        this.messages = [messages];
      }
    });
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
        this.messageService.add({
          severity: 'error',
          summary: 'Logging Error:',
          detail: 'Incorrect email or password',
          life: 2500,
        });
      })
      .finally(() => (this.isLoading = false));
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
