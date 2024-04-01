import { Component, Input } from '@angular/core';
import { UtilService } from 'src/app/shared/util.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css'],
})
export class MyPostsComponent {
  @Input('posts') posts: DatabasePost[] = [];
  @Input('isLoadingPosts') isLoadingPosts: boolean = true;
  @Input('isOwnPost') isOwnPost: boolean = false;

  constructor(private utilService: UtilService) {}

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
