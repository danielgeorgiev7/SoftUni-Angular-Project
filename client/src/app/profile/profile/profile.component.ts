import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabasePost } from 'src/app/types/DatabasePost';
import { DatabaseUser } from 'src/app/types/DatabaseUser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  dbUser: DatabaseUser | null = null;
  userSub: Subscription = new Subscription();
  profileId: string = '';
  routeSub: Subscription = new Subscription();
  posts: DatabasePost[] = [];
  isLoadingPosts: boolean = true;
  isOwnProfile: boolean = false;

  showEditProfile: boolean = false;
  editForm: FormGroup | null = null;
  showBlur = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      bio: [''],
      favoriteMovie: [''],
    });
    const userId = this.authService.user.value?.id;
    if (!userId) return;

    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      this.profileId = params['profileId'];
      if (this.profileId && userId && this.profileId === userId) {
        this.isOwnProfile = true;
      } else {
        this.isOwnProfile = false;
      }

      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  loadData() {
    this.userSub = this.databaseService.getUserData(this.profileId).subscribe(
      (dbUserData) => {
        this.dbUser = dbUserData;
        this.updateEditForm();
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
    this.databaseService.getPostsByUser(this.profileId).subscribe((posts) => {
      this.posts = posts;
      this.isLoadingPosts = false;
    });
  }

  updateEditForm() {
    if (this.editForm) {
      this.editForm.patchValue({
        bio: this.dbUser?.bio || '',
        favoriteMovie: this.dbUser?.favoriteMovie || '',
      });
    }
  }

  switchShowEdit() {
    this.showEditProfile = !this.showEditProfile;
    this.showBlur = !this.showBlur;
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
