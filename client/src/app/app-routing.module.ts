import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { CategoryComponent } from './category/category.component';
import { GenrePageComponent } from './category/genre-page/genre-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostsComponent } from './posts/posts/posts.component';
import { GuestGuardService } from './auth/guest-guard.service';
import { UserGuardService } from './auth/user-guard.service';
import { ProfileComponent } from './profile/profile/profile.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'categories',
    component: CategoryComponent,
  },
  {
    path: 'categories/:genre',
    component: GenrePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserGuardService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UserGuardService],
  },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'posts/:postId',
    component: PostDetailsComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [GuestGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
