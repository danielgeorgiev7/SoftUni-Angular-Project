import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitCamelCasePipe } from './split-camel-case.pipe';

@NgModule({
  declarations: [SplitCamelCasePipe],
  imports: [CommonModule],
  exports: [SplitCamelCasePipe],
})
export class PipesModule {}
