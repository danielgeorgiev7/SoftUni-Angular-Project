import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { DatabaseService } from 'src/app/database.service';
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

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService
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
      if (!this.currentUser) throw new Error('User not found!');
      if (!this.comment?.data) throw new Error('Comment not found!');
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
    } catch (err) {
      console.error(err);
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
