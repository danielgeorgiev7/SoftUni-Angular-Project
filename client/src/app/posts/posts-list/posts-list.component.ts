import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  posts: DatabasePost[] = [];
  isLoading = false;
  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.databaseService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }
}
