import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { GenrePageComponent } from './genre-page/genre-page.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
  },
  {
    path: ':genre',
    component: GenrePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
