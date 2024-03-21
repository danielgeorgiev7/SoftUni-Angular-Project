import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent {
  @Input('posts') posts: DatabasePost[] = [];
  isLoading = false;

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
