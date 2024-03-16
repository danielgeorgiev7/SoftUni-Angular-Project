import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoviesApiService } from 'src/app/movies-api.service';
import { Movie } from 'src/app/types/Movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  mostPopularMovies: Movie[] = [];
  mostPopularMoviesSub: Subscription = new Subscription();
  constructor(private moviesApiService: MoviesApiService) {}

  ngOnInit(): void {
    this.mostPopularMoviesSub = this.moviesApiService.popularMovies.subscribe(
      (movies) => {
        this.mostPopularMovies = movies;
        console.log(movies);
      }
    );
  }

  ngOnDestroy(): void {
    this.mostPopularMoviesSub.unsubscribe();
  }
}
