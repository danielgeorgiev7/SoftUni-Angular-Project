import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { UploadComponent } from './upload/upload.component';
import { SmallModalComponent } from './small-modal/small-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    UploadComponent,
    SmallModalComponent,
    EditModalComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, MessagesModule],
  exports: [
    LoadingSpinnerComponent,
    UploadComponent,
    SmallModalComponent,
    EditModalComponent,
  ],
})
export class SharedModule {}
