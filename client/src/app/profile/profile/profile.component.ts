import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/database.service';
import { DatabaseUser } from 'src/app/types/DatabaseUser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: DatabaseUser | null = null;
  userSub: Subscription = new Subscription();

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    const userDataJson = localStorage.getItem('userData');
    if (userDataJson === null) return;

    const userData = JSON.parse(userDataJson);
    const uid = userData.id;
    this.userSub = this.databaseService.getUserData(uid).subscribe(
      (dbUserData) => {
        this.user = dbUserData;
        console.log(dbUserData);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  formatDate(dateString: string | undefined) {
    if (dateString === undefined) return;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit', // 2-digit day (e.g., "19")
      month: '2-digit', // 2-digit month (e.g., "03")
      year: 'numeric', // full year (e.g., "2024")
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour12: false, // Use 24-hour format
    });
    return `${formattedDate} at ${formattedTime}`;
  }
}
