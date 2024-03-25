import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  isLoading = true;
  showDeleteModal = false;
  postId: string = '';

  post: DatabasePost | null = null;
  comments: DatabaseComment[] = [];
  currentUser: LocalUser | null = null;

  routeSub: Subscription = new Subscription();
  postSub: Subscription = new Subscription();
  commentSub: Subscription = new Subscription();
  currentUserSub: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      this.postId = params['postId'];
      this.postSub = this.databaseService
        .getSinglePost(this.postId)
        .subscribe((post) => {
          this.post = post;
          this.isLoading = false;
        });
      this.commentSub = this.databaseService
        .getComments(this.postId)
        .subscribe((comments: DatabaseComment[]) => {
          this.comments = comments;
        });
    });
    this.currentUserSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
    this.commentSub.unsubscribe();
  }

  switchDeleteModal = () => {
    this.showDeleteModal = !this.showDeleteModal;
  };

  onDeletePost() {
    this.databaseService
      .deletePost(this.postId)
      .then(() => this.router.navigate(['/posts']))
      .catch((error) => {
        console.log(error);
      });
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
