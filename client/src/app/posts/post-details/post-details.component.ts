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
  isLoading = true;
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
          this.isLoading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
  }

  formatDate(dateString: string | undefined) {
    if (dateString === undefined) return;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit', // 2-digit day (e.g., "19")
      month: '2-digit', // 2-digit month (e.g., "03")
      year: 'numeric', // full year (e.g., "2024")
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour12: false, // Use 24-hour format
    });
    return `${formattedDate} at ${formattedTime}`;
  }
}
