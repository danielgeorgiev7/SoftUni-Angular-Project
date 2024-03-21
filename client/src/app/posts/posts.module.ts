import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PostsListComponent } from './posts-list/posts-list.component';

@NgModule({
  declarations: [PostsComponent, PostsListComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [PostsComponent],
})
export class PostsModule {}
