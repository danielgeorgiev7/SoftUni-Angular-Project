import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PostsComponent, PostsListComponent, PostDetailsComponent],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule],
  exports: [PostsComponent],
})
export class PostsModule {}
