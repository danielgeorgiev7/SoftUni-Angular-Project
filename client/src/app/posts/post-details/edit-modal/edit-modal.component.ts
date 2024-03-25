import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
})
export class EditModalComponent implements OnInit {
  @Input('switchEditModal') switchEditModal: VoidFunction = () => {};
  @Input('post') post: DatabasePost | null = null;
  selectedFile: File | null = null;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.editForm.patchValue({
        title: this.post.title,
        content: this.post.content,
      });
    }
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  onSubmit() {}
}
