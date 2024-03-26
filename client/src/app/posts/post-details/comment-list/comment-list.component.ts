import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
})
export class CommentListComponent implements OnInit, OnDestroy {
  @Input('comments') comments: DatabaseComment[] = [];
  @Output() commentEdit = new EventEmitter<DatabaseComment>();
  @Output() commentDelete = new EventEmitter<DatabaseComment>();
  currentUser: LocalUser | null = null;
  currentUserSub: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;
    });
  }
  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

  emitCommentForEdit(comment: DatabaseComment) {
    this.commentEdit.emit(comment);
  }

  emitCommentForDelete(comment: DatabaseComment) {
    this.commentDelete.emit(comment);
  }
}
