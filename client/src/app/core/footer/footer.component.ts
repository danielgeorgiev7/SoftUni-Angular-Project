import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalUser } from 'src/app/auth/LocalUser.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  user: LocalUser | null = null;
  userSub: Subscription = new Subscription();
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user) => (this.user = user)
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
