import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  showCreatePost = false;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService
  ) {}

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

      await this.buildPost(title, content, downloadUrL);

      form.reset();
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }

  buildPost(title: string, content: string, photoURL: string) {
    const currentUser = this.authService.user.value;
    if (!currentUser || !currentUser.id)
      return Promise.reject(new Error('User is undefined'));
    const timestamp = new Date();
    const postId = timestamp.getTime().toString();

    const postData: DatabasePost = {
      createdAt: timestamp.toString(),
      updatedAt: '',
      userId: currentUser.id,
      username: currentUser.username,
      userPhoto: currentUser.imageUrl,
      attachedPhoto: photoURL || '',
      postId,
      title,
      content,
    };

    return this.databaseService.createPost(postData);
  }
}
