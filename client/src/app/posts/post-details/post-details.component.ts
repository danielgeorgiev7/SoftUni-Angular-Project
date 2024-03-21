import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/database.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  postId: string = '';
  post: DatabasePost | null = null;
  routeSub: Subscription = new Subscription();
  postSub: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      this.postId = params['postId'];
      this.postSub = this.databaseService
        .getSinglePost(this.postId)
        .subscribe((post) => {
          this.post = post;
          console.log(post);
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
  }
}
