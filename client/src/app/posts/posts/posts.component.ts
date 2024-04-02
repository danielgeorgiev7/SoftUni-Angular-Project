import { Component } from '@angular/core';
import { DatabasePost } from 'src/app/types/DatabasePost';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  posts: DatabasePost[] = [];
  isLoading: boolean = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.databaseService.getPosts().subscribe((posts) => {
      this.posts = posts.reverse();
      this.isLoading = false;
    });
  }
}
