import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/types/LocalUser';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':leave', [animate('0.2s ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  postId: string = '';
  showDeleteModalFor: string | null = null;
  showEditModalFor: string | null = null;
  hasUserLiked = false;
  isLoading = true;
  showBlur = false;

  post: DatabasePost | null = null;
  comments: DatabaseComment[] = [];
  currentComment: DatabaseComment | null = null;
  currentUser: LocalUser | null = null;
  editForm: FormGroup | null = null;

  routeSub: Subscription = new Subscription();
  postSub: Subscription = new Subscription();
  commentSub: Subscription = new Subscription();
  currentUserSub: Subscription = new Subscription();

  messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageHandlerService: MessagesHandlerService
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;

      this.routeSub = this.activatedRoute.params.subscribe((params) => {
        this.postId = params['postId'];
        this.postSub = this.databaseService
          .getSinglePost(this.postId)
          .subscribe((post) => {
            this.post = post;
            this.isLoading = false;
            if (
              this.post &&
              this.post.likes &&
              this.currentUser &&
              this.currentUser?.id in this.post.likes
            )
              this.hasUserLiked = true;
          });
        this.commentSub = this.databaseService
          .getComments(this.postId)
          .subscribe((comments: DatabaseComment[]) => {
            this.comments = comments;
          });
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
    this.commentSub.unsubscribe();
    this.currentUserSub.unsubscribe();
  }

  addMessages(msg: Message[]) {
    msg.forEach((message) => {
      this.messageHandlerService.addMessage(message);
    });
  }

  onLikeSwitch() {
    try {
      if (!this.currentUser) {
        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Unauthorized User:',
          detail: 'Try logging in again',
          life: 5000,
        });
        return;
      }
      if (!this.hasUserLiked) {
        this.databaseService
          .addLike('post', this.currentUser?.id, this.postId)
          .then(() => (this.hasUserLiked = true));
      } else {
        this.databaseService
          .removeLike('post', this.currentUser?.id, this.postId)
          .then(() => (this.hasUserLiked = false));
      }
    } catch (err) {
      console.error(err);
    }
  }

  getTotalLikes() {
    if (!this.post) return null;
    return Object.keys(this.post.likes).length;
  }

  closeDeleteModal() {
    this.showDeleteModalFor = null;
    this.showBlur = false;
  }

  closeEditModal() {
    this.showEditModalFor = null;
    this.showBlur = false;
  }

  onPostDeleteClick() {
    this.showDeleteModalFor = 'post';
    this.showBlur = true;
  }

  onCommentDeleteClick(comment: DatabaseComment) {
    this.currentComment = comment;
    this.showDeleteModalFor = 'comment';
    this.showBlur = true;
  }

  onPostEditClick() {
    this.showEditModalFor = 'post';
    this.editForm = this.buildEditForm();
    this.showBlur = true;
  }

  onCommentEditClick(comment: DatabaseComment) {
    this.showEditModalFor = 'comment';
    this.currentComment = comment;
    this.editForm = this.buildEditForm();
    this.showBlur = true;
  }

  onDeletePost() {
    this.databaseService
      .deletePost(this.postId)
      .then(() => {
        this.showDeleteModalFor = null;
        this.closeDeleteModal();
        this.messageHandlerService.addMessage({
          severity: 'success',
          summary: 'Success!',
          detail: 'Post has been deleted.',
          life: 5000,
        });
        this.router.navigate(['/posts']);
      })
      .catch((error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while deleting.';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Delete Error:',
          detail: errorMessage,
          life: 5000,
        });
      });
  }

  onDeleteComment() {
    if (!this.currentComment) return;
    this.databaseService
      .deleteComment(this.postId, this.currentComment.data.commentId)
      .then(() => {
        this.closeDeleteModal();
        this.messageHandlerService.addMessage({
          severity: 'success',
          summary: 'Success!',
          detail: 'Comment has been deleted.',
          life: 5000,
        });
      })
      .catch((error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while deleting.';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Delete Error:',
          detail: errorMessage,
          life: 5000,
        });
      });
  }

  buildEditForm(): FormGroup<any> | null {
    if (this.showEditModalFor == 'post') {
      return this.fb.group({
        title: [
          this.post?.data.title,
          [Validators.required, Validators.minLength(6)],
        ],
        content: [
          this.post?.data.content,
          [Validators.required, Validators.minLength(6)],
        ],
      });
    } else if (this.showEditModalFor == 'comment') {
      return this.fb.group({
        comment: [this.currentComment?.data.comment, Validators.required],
      });
    } else return null;
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
