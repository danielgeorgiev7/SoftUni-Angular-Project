import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/database.service';
import { UtilService } from 'src/app/shared/util.service';
import { DatabasePost } from 'src/app/types/DatabasePost';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
})
export class EditModalComponent implements OnInit {
  @Input('switchEditModal') switchEditModal: VoidFunction = () => {};
  @Input('post') post: DatabasePost | null = null;
  selectedFile: File | null = null;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private utilService: UtilService,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.editForm.patchValue({
        title: this.post.title,
        content: this.post.content,
      });
    }
  }

  onSelectedFileChange(selectedFile: File | null) {
    this.selectedFile = selectedFile;
  }

  async onSubmit() {
    if (this.editForm.invalid) return;
    if (!this.post) return;
    if (this.post.userId !== this.authService.user.value?.id) return; // error handling needed
    const { title, content } = this.editForm.value;
    try {
      const downloadUrL = await this.utilService.upload(this.selectedFile);
      const timestamp = new Date();

      const editData: Partial<DatabasePost> = {
        title,
        content,
        updatedAt: timestamp.toString(),
        attachedPhoto:
          downloadUrL === '' ? this.post.attachedPhoto : downloadUrL,
      };

      await this.databaseService.editPost(this.post.postId, editData);

      this.editForm.reset();
    } catch (error) {
      console.error('Error occurred while creating post:', error);
    } finally {
      this.selectedFile = null;
      this.switchEditModal();
    }
  }
}

// async onSubmit(form: NgForm) {
//     if (form.invalid) return;
//     this.isLoading = true;
//     const { title, content } = form.form.value;

//     try {
//       const downloadUrL = await this.utilService.upload(this.selectedFile);

//       await this.buildPost(title, content, downloadUrL);

//       form.reset();
//     } catch (error) {
//       console.error('Error occurred while creating post:', error);
//     } finally {
//       this.selectedFile = null;
//       this.isLoading = false;
//     }
//   }

//   buildPost(title: string, content: string, photoURL: string) {
//     const currentUser = this.authService.user.value;
//     if (!currentUser || !currentUser.id)
//       return Promise.reject(new Error('User is undefined'));
//     const timestamp = new Date();
//     const postId = timestamp.getTime().toString();

//     const postData: DatabasePost = {
//       createdAt: timestamp.toString(),
//       updatedAt: '',
//       userId: currentUser.id,
//       username: currentUser.username,
//       userPhoto: currentUser.imageUrl,
//       attachedPhoto: photoURL || '',
//       postId,
//       title,
//       content,
//     };

//     return this.databaseService.createPost(postData);
//   }
