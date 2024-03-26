import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  formatDate(dateString: string | undefined) {
    if (dateString === undefined) return;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit', // 2-digit day (e.g., "19")
      month: '2-digit', // 2-digit month (e.g., "03")
      year: 'numeric', // full year (e.g., "2024")
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour12: false, // Use 24-hour format
    });
    return `${formattedDate} at ${formattedTime}`;
  }

  async upload(selectedFile: File | null) {
    if (selectedFile === null) return '';

    if (this.authService.user.value?.id === undefined)
      throw new Error('User authentication failed.');

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (selectedFile !== null && selectedFile.size > maxSizeInBytes)
      throw new Error('File size exceeds the maximum limit of 5MB.');

    const path = `${this.authService.user.value.id}/${selectedFile.name}`;
    const uploadTask = await this.storage.upload(path, selectedFile);
    const downloadUrL = await uploadTask.ref.getDownloadURL();
    return downloadUrL;
  }
}
