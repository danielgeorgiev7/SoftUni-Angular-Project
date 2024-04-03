import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../types/Movie';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { MessagesHandlerService } from './messages-handler.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesApiService {
  constructor(
    private http: HttpClient,
    private messagesHandlerService: MessagesHandlerService
  ) {}

  private popularMoviesSubject = new BehaviorSubject<Movie[]>([]);
  popularMovies$ = this.popularMoviesSubject.asObservable();

  private topBoxOfficeMoviesSubject = new BehaviorSubject<Movie[]>([]);
  topBoxOfficeMovies$ = this.topBoxOfficeMoviesSubject.asObservable();

  getPopularMovies() {
    return this.http
      .get<{ movies: Movie[] }>(
        'https://moviesverse1.p.rapidapi.com/most-popular-movies',
        {
          headers: {
            'X-RapidAPI-Key': environment.moviesApiKey,
            'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com',
          },
        }
      )
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        this.popularMoviesSubject.next(response.movies.slice(0, 15));
      });
  }

  getTopBoxOfficeMovies() {
    return this.http
      .get<{ movies: Movie[] }>(
        'https://moviesverse1.p.rapidapi.com/top-box-office',
        {
          headers: {
            'X-RapidAPI-Key': environment.moviesApiKey,
            'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com',
          },
        }
      )
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        this.topBoxOfficeMoviesSubject.next(response.movies.slice(0, 10));
      });
  }

  getMoviesByGenre(genre: string) {
    return this.http
      .get<{ movies: Movie[] }>(
        'https://moviesverse1.p.rapidapi.com/get-by-genre',
        {
          params: { genre },
          headers: {
            'X-RapidAPI-Key': environment.moviesApiKey,
            'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com',
          },
        }
      )
      .pipe(
        map((movies) => {
          // console.log(movies);
          return movies?.movies.slice();
        }),
        catchError(this.handleError)
      );
  }

  private handleError() {
    this.messagesHandlerService.addMessage({
      severity: 'error',
      summary: 'Error:',
      detail: "Couldn't load movies data.",
    });
    return [];
  }
}
