import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselComponent } from './home/carousel/carousel.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent, CarouselComponent],
  imports: [CommonModule, SlickCarouselModule, SharedModule, RouterModule],
  exports: [HomeComponent],
})
export class HomeModule {}
