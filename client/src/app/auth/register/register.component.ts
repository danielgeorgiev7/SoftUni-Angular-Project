import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  signupSub: Subscription = new Subscription();
  isLoading: boolean = false;
  registerForm: FormGroup;
  messages: Message[] = [];
  messagesSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageHandlerService: MessagesHandlerService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.signupSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, email, password, rePassword } = this.registerForm.value;
    if (password !== rePassword) {
      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Signup Error:',
        detail: 'Passwords do not match',
        life: 5000,
      });
      this.registerForm.get('password')?.setValue('');
      this.registerForm.get('password')?.markAsUntouched();
      this.registerForm.get('rePassword')?.setValue('');
      this.registerForm.get('rePassword')?.markAsUntouched();
      return;
    }

    this.isLoading = true;
    this.authService
      .signUp(email, password, username)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Signup Error:',
          detail: 'Email is already in use.',
          life: 5000,
        });
        this.registerForm.reset();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
