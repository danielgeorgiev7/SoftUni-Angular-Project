import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit, OnDestroy {
  signupSub: Subscription = new Subscription();
  isLoading: boolean = false;
  error: string = '';
  messages: Message[] = [];
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.messageService.messageObserver.subscribe((messages) => {
      if (!Array.isArray(messages)) {
        this.messages.push(messages);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, email, password, rePassword } = this.registerForm.value;
    if (password !== rePassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Signup Error:',
        detail: 'Passwords do not match',
        life: 2500,
      });
      this.registerForm.get('password')?.setValue('');
      this.registerForm.get('password')?.markAsUntouched();
      this.registerForm.get('rePassword')?.setValue('');
      this.registerForm.get('rePassword')?.markAsUntouched();
    }

    this.isLoading = true;
    this.authService
      .signUp(email, password, username)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Error:',
          detail: 'Email is already in use.',
          life: 2500,
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.signupSub.unsubscribe();
  }
}
