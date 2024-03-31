import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  user: DatabaseUser | null = null;
  userSub: Subscription = new Subscription();
  posts: DatabasePost[] = [];
  selectedFile: File | null = null;
  isLoadingPosts: boolean = true;

  constructor(
    private databaseService: DatabaseService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    const userDataJson = localStorage.getItem('userData');
    if (!userDataJson) return;

    const userData = JSON.parse(userDataJson);
    const uid = userData.id;
    this.userSub = this.databaseService.getUserData(uid).subscribe(
      (dbUserData) => {
        this.user = dbUserData;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
    this.databaseService.getPostsByUser(uid).subscribe((posts) => {
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

  changeImage() {}

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
