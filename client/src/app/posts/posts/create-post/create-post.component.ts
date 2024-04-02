import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';
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
  postForm: FormGroup;
  messages: Message[] = [];

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private messageHandlerService: MessagesHandlerService
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      content: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  switchShowCreatePost() {
    this.showCreatePost = !this.showCreatePost;
    this.postForm.reset();
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit() {
    if (this.postForm.invalid) return;

    this.isLoading = true;
    const { title, content } = this.postForm.value;

    try {
      const downloadUrL = await this.utilService.upload(this.selectedFile);
      await this.buildPost(title, content, downloadUrL);

      this.postForm.reset();
      this.showCreatePost = false;
      this.messageHandlerService.addMessage({
        severity: 'success',
        summary: 'Success!',
        detail: 'Post has been created.',
        life: 2500,
      });
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An error occurred while editing.';
      }

      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Editing Error:',
        detail: errorMessage,
        life: 2500,
      });
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }

  buildPost(title: string, content: string, photoURL: string) {
    const currentUser = this.authService.user.value;
    if (!currentUser || !currentUser.id) {
      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Unauthorized User:',
        detail: 'Try logging in again',
        life: 2500,
      });
      return;
    }
    const timestamp = new Date();
    const postId = timestamp.getTime().toString();

    const postData: DatabasePost = {
      data: {
        createdAt: timestamp.toString(),
        updatedAt: '',
        userId: currentUser.id,
        username: currentUser.username,
        userPhoto: currentUser.imageUrl,
        attachedPhoto: photoURL || '',
        postId,
        title,
        content,
      },
      likes: [],
    };

    return this.databaseService.createPost(postData);
  }
}
