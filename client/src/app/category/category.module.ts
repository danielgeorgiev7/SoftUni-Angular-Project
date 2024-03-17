import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule } from '@angular/router';
import { GenrePageComponent } from './genre-page/genre-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CategoryComponent, GenrePageComponent],
  imports: [CommonModule, RouterModule, SharedModule],
})
export class CategoryModule {}
