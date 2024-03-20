import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  isLoading: boolean = false;
  error: string = '';
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    const { title, content } = form.form.value;
    if (form.invalid) return;
    this.isLoading = true;
    this.authService
      .createPost(title, content)
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.log(error);
        console.error('Error signing up:', error);
      });
  }
}
