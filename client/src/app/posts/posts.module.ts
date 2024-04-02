import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PostDetailsComponent } from './post-details/post-details.component';
import { RouterModule } from '@angular/router';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { environment } from 'src/environments/environment.development';
import { AddCommentComponent } from './post-details/add-comment/add-comment.component';
import { CommentListComponent } from './post-details/comment-list/comment-list.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { CommentComponent } from './post-details/comment-list/comment/comment.component';

@NgModule({
  declarations: [
    PostsComponent,
    PostsListComponent,
    PostDetailsComponent,
    AddCommentComponent,
    CommentListComponent,
    CreatePostComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule.pick(environment.icons),
  ],
  exports: [PostsComponent],
})
export class PostsModule {}
