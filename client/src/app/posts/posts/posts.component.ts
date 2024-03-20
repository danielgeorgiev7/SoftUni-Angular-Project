import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  isLoading: boolean = false;
  error: string = '';
  photoUrl: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async upload() {
    if (this.selectedFile === null)
      throw new Error(
        'An error occurred while uploading file. Please try again.'
      );
    if (this.authService.user.value?.id === undefined)
      throw new Error('User authentication failed.');

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (this.selectedFile.size > maxSizeInBytes)
      throw new Error('File size exceeds the maximum limit of 5MB.');

    const path = `${this.authService.user.value.id}/${this.selectedFile.name}`;
    const uploadTask = await this.storage.upload(path, this.selectedFile);
    const downloadUrL = await uploadTask.ref.getDownloadURL();
    return downloadUrL;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    const { title, content } = form.form.value;

    try {
      const downloadUrL = await this.upload();

      await this.authService.createPost(title, content, downloadUrL);

      form.reset();
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.isLoading = false;
    }
  }
}
