import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseCommentData } from 'src/app/types/DatabaseComment';
import { DatabasePostData } from 'src/app/types/DatabasePost';
import { DatabaseUser } from 'src/app/types/DatabaseUser';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ top: '-650px', opacity: 0 }),
        animate('0.3s ease-out', style({ top: '0', opacity: 1 })),
      ]),
    ]),
  ],
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

  isFormChanged(): boolean {
    return JSON.stringify(this.editForm.value) !== JSON.stringify(this.values);
  }

  async onSubmit() {
    if (this.editForm.invalid) return;
    if (!this.data || !this.dataType) return;
    if (this.data.userId !== this.authService.user.value?.id) {
      this.messages.push({
        severity: 'error',
        summary: 'Unauthorized User:',
        detail: 'Try logging in again',
        life: 5000,
      });
      this.messageEmit.emit(this.messages);
      return;
    }

    try {
      if (!this.isFormChanged() && this.selectedFile === null) {
        this.messages.push({
          severity: 'error',
          summary: 'Error:',
          detail: 'No changes were made',
          life: 5000,
        });
        return;
      }

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
        (editData as Partial<DatabaseUser>).favoriteMovie =
          this.editForm.value.favoriteMovie;
        await this.databaseService.updateUserData(
          (this.data as DatabaseUser).userId,
          editData
        );
        if (downloadUrl !== '') {
          await this.authService.updateUserPhoto(this.data.userId, downloadUrl);
        }
      }

      this.messages.push({
        severity: 'success',
        summary: 'Success!',
        detail: `${
          this.dataType.charAt(0).toUpperCase() + this.dataType.slice(1)
        } has been ${this.dataType === 'profile' ? 'updated' : 'edited'}.`,
        life: 5000,
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
        life: 5000,
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
      this.dataType === 'profile' ||
      !!(this.data as DatabaseCommentData | DatabasePostData).attachedPhoto
        ?.length
    ) {
      return 'Change Photo';
    }
    return 'Attach Photo';
  }
}
