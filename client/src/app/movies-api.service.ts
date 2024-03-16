import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from './types/Movie';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesApiService {
  constructor(private http: HttpClient) {}
  popularMovies = new BehaviorSubject<Movie[]>([]);

  getPopularMovies() {
    this.http
      .get<{ movies: Movie[] }>(
        'https://moviesverse1.p.rapidapi.com/most-popular-movies',
        {
          headers: {
            'X-RapidAPI-Key': environment.moviesApiKey,
            'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com',
          },
        }
      )
      .pipe(
        map(
          (movies) => {
            return movies?.movies.slice(0, 10);
          },
          catchError((error: HttpErrorResponse) => {
            console.error('An error occurred:', error);
            return throwError('Something went wrong. Please try again later.'); // Return a custom error message
          })
        )
      )
      .subscribe((movies) => {
        this.popularMovies.next(movies);
        // console.log(movies);
      });
  }
}
