import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesApiService } from 'src/app/services/movies-api.service';
import { Movie } from 'src/app/types/Movie';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  @Input('title') title: string = '';
  @Input('movies') movies: Movie[] = [];

  constructor(
    private router: Router,
    private moviesApiService: MoviesApiService
  ) {}

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    infinite: true,
    responsive: [],
  };
}
