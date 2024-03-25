import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  isLoading = true;
  postId: string = '';
  post: DatabasePost | null = null;
  comments: DatabaseComment[] = [];
  routeSub: Subscription = new Subscription();
  postSub: Subscription = new Subscription();
  commentSub: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private utilService: UtilService
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
          console.log(this.comments);
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
    this.commentSub.unsubscribe();
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
