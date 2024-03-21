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

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFile = inputElement.files?.[0] || null;
    this.selectedFileChange.emit(this.selectedFile);
  }

  removeSelectedFile(fileInput: HTMLInputElement) {
    fileInput.value = '';
    fileInput.dispatchEvent(new Event('change'));
  }
}
