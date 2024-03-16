import { Component, Input } from '@angular/core';
import { Movie } from 'src/app/types/Movie';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  @Input('title') title: string = '';
  @Input('movies') movies: Movie[] = [];

  slides = [
    { img: '/assets/1.jpg' },
    { img: '/assets/2.jpg' },
    { img: '/assets/3.jpg' },
    { img: '/assets/1.jpg' },
    { img: '/assets/2.jpg' },
    { img: '/assets/3.jpg' },
    { img: '/assets/1.jpg' },
    { img: '/assets/2.jpg' },
    { img: '/assets/3.jpg' },
  ];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    infinite: true,
    responsive: [
      // {
      //   breakpoint: 992,
      //   settings: {
      //     arrows: true,
      //     infinite: true,
      //     slidesToShow: 3,
      //     slidesToScroll: 3,
      //   },
      // },
      // {
      //   breakpoint: 768,
      //   settings: {
      //     arrows: true,
      //     infinite: true,
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //   },
      // },
    ],
  };
}
