import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseCommentData } from 'src/app/types/DatabaseComment';
import { DatabasePostData } from 'src/app/types/DatabasePost';
import { DatabaseUser } from 'src/app/types/DatabaseUser';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
  providers: [MessageService],
})
export class EditModalComponent implements OnInit {
  @Input('closeEditModal') closeEditModal: VoidFunction | null = null;
  @Input('data') data:
    | DatabasePostData
    | DatabaseCommentData
    | DatabaseUser
    | undefined
    | null = null;
  @Input('dataType') dataType: string | null = null;
  @Input('editForm') editForm: FormGroup = new FormGroup({});
  @Output('messages') messageEmit: EventEmitter<Message[]> = new EventEmitter();
  values: { [key: string]: any } = {};
  selectedFile: File | null = null;
  messages: Message[] = [];

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.values = this.editForm.value;
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit() {
    if (this.editForm.invalid) return;
    if (!this.data || !this.dataType) return;
    if (this.data.userId !== this.authService.user.value?.id) {
      this.messages.push({
        severity: 'error',
        summary: 'Unauthorized User:',
        detail: 'Try logging in again',
        life: 2500,
      });
      return;
    }

    try {
      const downloadUrl = await this.utilService.upload(this.selectedFile);
      const timestamp = new Date();

      let editData = {};
      if (this.dataType === 'post' || this.dataType === 'comment') {
        editData = {
          updatedAt: timestamp.toString(),
          attachedPhoto:
            downloadUrl === ''
              ? (this.data as DatabasePostData | DatabaseCommentData)
                  .attachedPhoto
              : downloadUrl,
        };
      }

      if (this.dataType === 'post') {
        (editData as Partial<DatabasePostData>).title =
          this.editForm.value.title;
        (editData as Partial<DatabasePostData>).content =
          this.editForm.value.content;

        await this.databaseService.editPost(
          (this.data as DatabasePostData).postId,
          editData
        );
      }
      if (this.dataType === 'comment') {
        (editData as Partial<DatabaseCommentData>).comment =
          this.editForm.value.comment;

        await this.databaseService.editComment(
          (this.data as DatabaseCommentData).postId,
          (this.data as DatabaseCommentData).commentId,
          editData
        );
      }
      if (this.dataType === 'profile') {
        (editData as Partial<DatabaseUser>).bio = this.editForm.value.bio;
        await this.databaseService.updateUserBio(
          (this.data as DatabaseUser).userId,
          editData
        );
        if (downloadUrl !== '') {
          await this.databaseService.changeImage(this.data.userId, downloadUrl);
        }
      }

      this.messages.push({
        severity: 'success',
        summary: 'Success!',
        detail: `${
          this.dataType.charAt(0).toUpperCase() + this.dataType.slice(1)
        } has been ${this.dataType === 'profile' ? 'updated' : 'edited'}.`,
        life: 2500,
      });

      this.editForm.reset();
    } catch (error: any) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = `An error occurred while  ${
          this.dataType === 'profile' ? 'updating' : 'editing'
        }.`;
      }

      this.messages.push({
        severity: 'error',
        summary: `${
          this.dataType === 'profile' ? 'Updating' : 'Editing'
        } Error:`,
        detail: errorMessage,
        life: 2500,
      });
    } finally {
      this.selectedFile = null;
      this.messageEmit.emit(this.messages);
      this.messages = [];
      if (this.closeEditModal) this.closeEditModal();
    }
  }

  getBtnText() {
    if (
      this.dataType !== 'profile' ||
      !!(this.data as DatabaseCommentData | DatabasePostData).attachedPhoto
        ?.length
    ) {
      return 'Change Photo';
    }
    return 'Attach Photo';
  }
}
