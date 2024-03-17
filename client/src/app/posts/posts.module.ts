import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [PostsComponent],
  imports: [CommonModule],
  exports: [PostsComponent],
})
export class PostsModule {}
