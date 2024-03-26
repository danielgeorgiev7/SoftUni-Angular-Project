import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
})
export class EditModalComponent implements OnInit {
  @Input('closeEditModal') closeEditModal: VoidFunction | null = null;
  @Input('data') data: DatabasePost | DatabaseComment | null = null;
  @Input('dataType') dataType: string | null = null;
  @Input('editForm') editForm: FormGroup = new FormGroup({});
  // values: [string, unknown][] = [];
  values: { [key: string]: any } = {};

  selectedFile: File | null = null;

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.values = Object.entries(this.editForm.value);
    this.values = this.editForm.value;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit() {
    if (this.editForm.invalid) return;
    if (!this.data) return;
    if (this.data.userId !== this.authService.user.value?.id) return; // error handling needed
    try {
      const downloadUrL = await this.utilService.upload(this.selectedFile);
      const timestamp = new Date();

      const editData: Partial<DatabasePost> | Partial<DatabaseComment> = {
        updatedAt: timestamp.toString(),
        attachedPhoto:
          downloadUrL === '' ? this.data.attachedPhoto : downloadUrL,
      };

      if (this.dataType === 'post') {
        (editData as Partial<DatabasePost>).title = this.editForm.value.title;
        (editData as Partial<DatabasePost>).content =
          this.editForm.value.content;

        await this.databaseService.editPost(this.data.postId, editData);
      }
      if (this.dataType === 'comment') {
        (editData as Partial<DatabaseComment>).comment =
          this.editForm.value.comment;

        await this.databaseService.editComment(
          this.data.postId,
          (this.data as DatabaseComment).commentId,
          editData
        );
      }

      this.editForm.reset();
    } catch (error) {
      console.error('Error occurred while editing post:', error);
    } finally {
      this.selectedFile = null;
      if (this.closeEditModal) this.closeEditModal();
    }
  }
}
