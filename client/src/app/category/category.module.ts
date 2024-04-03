import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { GenrePageComponent } from './genre-page/genre-page.component';
import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CategoryComponent, GenrePageComponent],
  imports: [CommonModule, CategoryRoutingModule, SharedModule],
})
export class CategoryModule {}
