import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PostsComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [PostsComponent],
})
export class PostsModule {}
