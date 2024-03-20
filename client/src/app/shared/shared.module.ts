import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [LoadingSpinnerComponent, UploadComponent],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, UploadComponent],
})
export class SharedModule {}
