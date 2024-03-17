import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  genres = [
    'action',
    'adventure',
    'animation',
    'biography',
    'comedy',
    'documentary',
    'drama',
    'family',
    'fantasy',
    'history',
    'horror',
    'music',
    'musical',
    'mystery',
    'romance',
    'sci-fi',
    'sport',
    'thriller',
    'war',
    'western',
  ];
}
