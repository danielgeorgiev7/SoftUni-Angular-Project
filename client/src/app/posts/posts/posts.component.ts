import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabasePost } from 'src/app/types/DatabasePost';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  showCreatePost = false;
  posts: DatabasePost[] = [];
  selectedFile: File | null = null;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.databaseService.getPosts().subscribe((posts) => {
      this.posts = posts.reverse();
      this.isLoading = false;
    });
  }

  switchShowCreatePost() {
    this.showCreatePost = !this.showCreatePost;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    const { title, content } = form.form.value;

    try {
      const downloadUrL = await this.utilService.upload(this.selectedFile);

      await this.authService.createPost(title, content, downloadUrL);

      form.reset();
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }
}
