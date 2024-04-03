import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesHandlerService } from 'src/app/services/messages-handler.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabasePost } from 'src/app/types/DatabasePost';
import { DatabaseUser } from 'src/app/types/DatabaseUser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':leave', [animate('0.2s ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  dbUser: DatabaseUser | null = null;
  userSub: Subscription = new Subscription();

  posts: DatabasePost[] = [];
  postsSub: Subscription = new Subscription();
  isLoadingPosts: boolean = true;

  showEditProfile: boolean = false;
  editForm: FormGroup | null = null;
  showBlur = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private messageHandlerService: MessagesHandlerService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.user.value?.id;
    if (!userId) return;

    this.userSub = this.databaseService.getUserData(userId).subscribe(
      (dbUserData) => {
        this.dbUser = dbUserData;
        console.log(this.editForm);
      },
      (error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while retrieving user data';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
        });
      }
    );

    this.postsSub = this.databaseService.getPostsByUser(userId).subscribe(
      (posts) => {
        this.posts = posts;
        this.isLoadingPosts = false;
      },
      (error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while retrieving user posts';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.postsSub.unsubscribe();
  }

  buildEditForm(): FormGroup<any> | null {
    return this.fb.group({
      bio: [this.dbUser?.bio || ''],
      favoriteMovie: [this.dbUser?.favoriteMovie || ''],
    });
  }

  switchShowEdit() {
    this.showEditProfile = !this.showEditProfile;
    this.showBlur = !this.showBlur;
    if (this.showEditProfile) this.editForm = this.buildEditForm();
  }

  addMessages(msg: Message[]) {
    msg.forEach((message) => {
      this.messageHandlerService.addMessage(message);
    });
  }

  getFormattedDate(dateString: string | undefined) {
    return this.utilService.formatDate(dateString);
  }
}
