import { Component } from '@angular/core';
import { MoviesApiService } from './movies-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private moviesApiService: MoviesApiService) {}

  ngOnInit(): void {
    this.moviesApiService.getPopularMovies();
    this.moviesApiService.getTopBoxOffice();
  }
}
