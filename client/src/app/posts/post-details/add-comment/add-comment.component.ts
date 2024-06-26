import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
  @Input('postId') postId: string = '';
  selectedFile: File | null = null;
  addCommentMode = false;
  commentForm: FormGroup;

  messages: Message[] = [];
  messagesSub: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private databaseService: DatabaseService,
    private messageHandlerService: MessagesHandlerService
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.messagesSub.unsubscribe();
  }

  switchAddCommentMode() {
    this.addCommentMode = !this.addCommentMode;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit() {
    if (this.commentForm.invalid || this.postId === '') return;
    const { comment } = this.commentForm.value;

    try {
      const downloadUrl = await this.utilService.upload(this.selectedFile);
      await this.buildComment(this.postId, comment, downloadUrl);

      this.commentForm.reset();
      this.addCommentMode = false;
      this.messageHandlerService.addMessage({
        severity: 'success',
        summary: 'Success!',
        detail: 'Comment has been added.',
        life: 5000,
      });
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An error occurred while commenting.';
      }

      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Error:',
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      this.selectedFile = null;
    }
  }

  buildComment(postId: string, comment: string, photoURL: string) {
    const currentUser = this.authService.user.value;
    if (!currentUser || !currentUser.id) {
      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Unauthorized User:',
        detail: 'Try logging in again',
        life: 5000,
      });
      return;
    }

    const timestamp = new Date();
    const commentId = timestamp.getTime().toString();

    const commentData: DatabaseComment = {
      data: {
        createdAt: timestamp.toString(),
        updatedAt: '',
        userId: currentUser.id,
        username: currentUser.username,
        userPhoto: currentUser.imageUrl,
        attachedPhoto: photoURL || '',
        postId,
        commentId,
        comment,
      },
      likes: [],
    };

    return this.databaseService.createComment(commentData);
  }
}
