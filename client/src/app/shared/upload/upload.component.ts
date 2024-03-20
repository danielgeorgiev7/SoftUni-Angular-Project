import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  @Input() selectedFile: File | null = null;
  @Output() selectedFileChange = new EventEmitter<File | null>();

  constructor(private authService: AuthService) {}

  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileChange.emit(this.selectedFile);
  }
}
