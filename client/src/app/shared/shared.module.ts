import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { UploadComponent } from './upload/upload.component';
import { SmallModalComponent } from './small-modal/small-modal.component';

@NgModule({
  declarations: [LoadingSpinnerComponent, UploadComponent, SmallModalComponent],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, UploadComponent, SmallModalComponent],
})
export class SharedModule {}
