import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  providers: [MessageService],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input('comment') comment: DatabaseComment | null = null;
  @Input('currentUser') currentUser: LocalUser | null = null;
  @Output() commentEdit = new EventEmitter<DatabaseComment>();
  @Output() commentDelete = new EventEmitter<DatabaseComment>();
  hasUserLiked = false;

  messages: Message[] = [];
  messagesSub: Subscription = new Subscription();

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messagesSub = this.messageService.messageObserver.subscribe(
      (messages) => {
        if (Array.isArray(messages)) {
          this.messages = messages;
        } else {
          this.messages = [messages];
        }
      }
    );
    if (
      this.comment &&
      this.comment.likes &&
      this.currentUser &&
      this.currentUser?.id in this.comment.likes
    )
      this.hasUserLiked = true;
  }

  ngOnDestroy(): void {
    this.messagesSub.unsubscribe();
  }

  onLikeSwitch() {
    try {
      if (!this.currentUser) {
        this.messageService.add({
          severity: 'error',
          summary: 'Unauthorized User:',
          detail: 'Try logging in again',
          life: 2500,
        });
        return;
      }
      if (!this.comment?.data) {
        this.messageService.add({
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

      this.messageService.add({
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
