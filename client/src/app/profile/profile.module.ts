import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MyPostsComponent } from './profile/my-posts/my-posts.component';
import { RouterModule } from '@angular/router';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';

@NgModule({
  declarations: [ProfileComponent, MyPostsComponent, EditProfileComponent],
  imports: [CommonModule, SharedModule, RouterModule],
})
export class ProfileModule {}
