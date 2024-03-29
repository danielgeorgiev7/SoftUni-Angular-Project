import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  // animations: [
  //   trigger('modalAnimation', [
  //     transition(':enter', [
  //       style({ transform: 'translateY(-100%)', opacity: 0 }),
  //       animate(
  //         '0.3s ease-out',
  //         style({ transform: 'translateY(0)', opacity: 1 })
  //       ),
  //     ]),
  //     transition(':leave', [
  //       animate(
  //         '0.3s ease-in',
  //         style({ transform: 'translateY(-100%)', opacity: 0 })
  //       ),
  //     ]),
  //   ]),
  // ],
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
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
  }

  onLikeSwitch() {
    try {
      if (!this.currentUser) throw new Error('User not found!');
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

  switchBlur() {
    this.showBlur = !this.showBlur;
  }

  closeDeleteModal() {
    this.showDeleteModalFor = null;
    this.switchBlur();
  }

  closeEditModal() {
    this.showEditModalFor = null;
    this.switchBlur();
  }

  onPostDeleteClick() {
    this.showDeleteModalFor = 'post';
    this.switchBlur();
  }

  onCommentDeleteClick(comment: DatabaseComment) {
    this.currentComment = comment;
    this.showDeleteModalFor = 'comment';
    this.switchBlur();
  }

  onPostEditClick() {
    this.showEditModalFor = 'post';
    this.editForm = this.buildEditForm();
    this.switchBlur();
  }

  onCommentEditClick(comment: DatabaseComment) {
    this.showEditModalFor = 'comment';
    this.currentComment = comment;
    this.editForm = this.buildEditForm();
    this.switchBlur();
  }

  onDeletePost() {
    this.databaseService
      .deletePost(this.postId)
      .then(() => {
        this.showDeleteModalFor = null;
        this.closeDeleteModal();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onDeleteComment() {
    if (!this.currentComment) return;
    this.databaseService
      .deleteComment(this.postId, this.currentComment.data.commentId)
      .then(() => {
        this.closeDeleteModal();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  buildEditForm(): FormGroup<any> | null {
    if (this.showEditModalFor == 'post') {
      return (this.editForm = this.fb.group({
        title: [this.post?.data.title, Validators.required],
        content: [this.post?.data.content, Validators.required],
      }));
    } else if (this.showEditModalFor == 'comment') {
      return (this.editForm = this.fb.group({
        comment: [this.currentComment?.data.comment, Validators.required],
      }));
    } else return null;
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
