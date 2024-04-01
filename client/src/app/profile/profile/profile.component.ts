import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  posts: DatabasePost[] = [];
  isLoadingPosts: boolean = true;

  showEditProfile: boolean = false;
  editForm: FormGroup | null = null;
  showBlur = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      bio: [''],
    });
    const userId = this.authService.user.value?.id;
    if (!userId) return;
    // error message for user

    this.userSub = this.databaseService.getUserData(userId).subscribe(
      (dbUserData) => {
        this.dbUser = dbUserData;
        this.updateEditForm();
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
    this.databaseService.getPostsByUser(userId).subscribe((posts) => {
      this.posts = posts;
      this.isLoadingPosts = false;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  updateEditForm() {
    if (this.editForm) {
      this.editForm.patchValue({
        bio: this.dbUser?.bio || '',
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
