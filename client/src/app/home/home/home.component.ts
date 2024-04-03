import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoviesApiService } from 'src/app/services/movies-api.service';
import { Movie } from 'src/app/types/Movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  mostPopularMovies: Movie[] = [];
  topBoxOfficeMovies: Movie[] = [];
  mostPopularMoviesSub: Subscription = new Subscription();
  topBoxOfficeMoviesSub: Subscription = new Subscription();

  constructor(private moviesApiService: MoviesApiService) {}

  ngOnInit(): void {
    this.mostPopularMoviesSub = this.moviesApiService.popularMovies$.subscribe(
      (movies) => {
        this.mostPopularMovies = movies;
      }
    );
    this.topBoxOfficeMoviesSub =
      this.moviesApiService.topBoxOfficeMovies$.subscribe((movies) => {
        this.topBoxOfficeMovies = movies;
      });

    // Fetch data only if not already fetched
    if (this.mostPopularMovies.length === 0) {
      this.moviesApiService.getPopularMovies();
    }
    if (this.topBoxOfficeMovies.length === 0) {
      this.moviesApiService.getTopBoxOfficeMovies();
    }
  }

  ngOnDestroy(): void {
    this.mostPopularMoviesSub.unsubscribe();
    this.topBoxOfficeMoviesSub.unsubscribe();
  }
}
