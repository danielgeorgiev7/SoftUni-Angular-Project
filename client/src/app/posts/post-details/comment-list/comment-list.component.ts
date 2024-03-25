import { Component, Input } from '@angular/core';
import { UtilService } from 'src/app/shared/util.service';
import { DatabaseComment } from 'src/app/types/DatabaseComment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
})
export class CommentListComponent {
  @Input('comments') comments: DatabaseComment[] = [];

  constructor(private utilService: UtilService) {}

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
