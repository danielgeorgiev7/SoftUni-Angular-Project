import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { UtilService } from 'src/app/shared/util.service';

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
    private utilService: UtilService
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

      await this.authService.createComment(this.postId, comment, downloadUrL);

      form.reset();
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }
}
