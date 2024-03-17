import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MoviesApiService } from 'src/app/movies-api.service';
import { Movie } from 'src/app/types/Movie';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.css'],
})
export class GenrePageComponent implements OnInit, OnDestroy {
  genre: string = '';
  movies: Movie[] = [];
  routeSub: Subscription = new Subscription();
  apiSub: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesApiService: MoviesApiService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      this.genre = params['genre'];
    });
    this.apiSub = this.moviesApiService
      .getMoviesByGenre(this.genre)
      .subscribe((movies) => (this.movies = movies));
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.apiSub.unsubscribe();
  }

  onLoadMore(): void {}
}
