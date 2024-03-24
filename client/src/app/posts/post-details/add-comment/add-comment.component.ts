import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent {
  selectedFile: File | null = null;
  addCommentMode = false;

  switchAddCommentMode() {
    this.addCommentMode = !this.addCommentMode;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  onSubmit(form: NgForm) {}
}
