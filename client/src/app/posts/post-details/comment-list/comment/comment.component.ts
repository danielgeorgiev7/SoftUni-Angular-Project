import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input('comment') comment: DatabaseComment | null = null;
  @Input('currentUser') currentUser: LocalUser | null = null;
  @Output() commentEdit = new EventEmitter<DatabaseComment>();
  @Output() commentDelete = new EventEmitter<DatabaseComment>();
  hasUserLiked = false;

  messages: Message[] = [];

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private messageHandlerService: MessagesHandlerService
  ) {}

  ngOnInit(): void {
    if (
      this.comment &&
      this.comment.likes &&
      this.currentUser &&
      this.currentUser?.id in this.comment.likes
    )
      this.hasUserLiked = true;
  }

  onLikeSwitch() {
    try {
      if (!this.currentUser) {
        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Unauthorized User:',
          detail: 'Try logging in again',
          life: 2500,
        });
        return;
      }
      if (!this.comment?.data) {
        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Comment not found.',
          detail: 'Try refreshing the page.',
          life: 2500,
        });
        return;
      }
      if (!this.hasUserLiked) {
        this.databaseService
          .addLike(
            'comment',
            this.currentUser?.id,
            this.comment.data.postId,
            this.comment?.data.commentId
          )
          .then(() => (this.hasUserLiked = true));
      } else {
        this.databaseService
          .removeLike(
            'comment',
            this.currentUser?.id,
            this.comment.data.postId,
            this.comment?.data.commentId
          )
          .then(() => (this.hasUserLiked = false));
      }
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = `An error occurred while ${
          this.hasUserLiked ? 'un' : ''
        }liking.`;
      }

      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Commenting Error:',
        detail: errorMessage,
        life: 2500,
      });
    }
  }

  emitCommentForEdit(comment: DatabaseComment) {
    this.commentEdit.emit(comment);
  }

  emitCommentForDelete(comment: DatabaseComment) {
    this.commentDelete.emit(comment);
  }

  getTotalLikes() {
    if (!this.comment) return null;
    return Object.keys(this.comment.likes).length;
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
