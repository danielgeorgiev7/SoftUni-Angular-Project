import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selectedFile: File | null = null;
  isLoadingPosts: boolean = true;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.user.value?.id;
    if (!userId) return;
    // error message for user

    this.userSub = this.databaseService.getUserData(userId).subscribe(
      (dbUserData) => {
        this.dbUser = dbUserData;
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

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async changeImage() {
    try {
      const downloadUrl = await this.utilService.upload(this.selectedFile);
      if (downloadUrl === '') return;
      // error message for selected file
      if (!this.dbUser) return;
      // error message for user
      await this.databaseService.changeImage(this.dbUser.userId, downloadUrl);
    } catch (error) {
      console.log(error);
    } finally {
      this.selectedFile = null;
    }
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
