import { Component } from '@angular/core';
import { MoviesApiService } from './movies-api.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private moviesApiService: MoviesApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.moviesApiService.getPopularMovies();
    this.moviesApiService.getTopBoxOffice();
    const userData = localStorage.getItem('userData');

    if (!userData) return;
    this.authService.user.next(JSON.parse(userData));
  }
}
