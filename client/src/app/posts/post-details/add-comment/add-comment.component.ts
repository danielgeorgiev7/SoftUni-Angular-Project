import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent {
  @Input('postId') postId: string = '';
  selectedFile: File | null = null;
  addCommentMode = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private databaseService: DatabaseService
  ) {}

  switchAddCommentMode() {
    this.addCommentMode = !this.addCommentMode;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    if (this.postId === '') return;
    this.isLoading = true;
    const { comment } = form.form.value;

    try {
      const downloadUrL = await this.utilService.upload(this.selectedFile);

      await this.buildComment(this.postId, comment, downloadUrL);

      form.reset();
      this.addCommentMode = false;
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }

  buildComment(postId: string, comment: string, photoURL: string) {
    const currentUser = this.authService.user.value;
    if (!currentUser || !currentUser.id)
      return Promise.reject(new Error('User is undefined'));

    const timestamp = new Date();
    const commentId = timestamp.getTime().toString();

    const commentData: DatabaseComment = {
      createdAt: timestamp.toString(),
      updatedAt: '',
      userId: currentUser.id,
      username: currentUser.username,
      userPhoto: currentUser.imageUrl,
      attachedPhoto: photoURL || '',
      postId,
      commentId,
      comment,
    };

    return this.databaseService.createComment(commentData);
  }
}
