import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MyPostsComponent } from './profile/my-posts/my-posts.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [ProfileComponent, MyPostsComponent],
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
})
export class ProfileModule {}
