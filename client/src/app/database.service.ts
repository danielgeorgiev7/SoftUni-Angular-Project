import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { DatabaseUser } from './types/DatabaseUser';
import { DatabasePost } from './types/DatabasePost';
import { DatabaseComment } from './types/DatabaseComment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  createUserNode(userId: string, userData: DatabaseUser) {
    return this.db.object(`users/${userId}`).set(userData);
  }

  getUserData(uid: string): Observable<DatabaseUser | null> {
    const userRef = this.db.object<DatabaseUser | null>(`users/${uid}`);
    return userRef.valueChanges();
  }

  createPost(postData: DatabasePost) {
    return this.db.object(`posts/${postData.postId}`).set(postData);
  }

  createComment(commentData: DatabaseComment) {
    console.log(commentData);
    return this.db
      .object(`comments/${commentData.postId}/${commentData.commentId}`)
      .set(commentData);
  }

  getPosts(): Observable<DatabasePost[]> {
    return this.db.list<DatabasePost>('posts').valueChanges();
  }

  getSinglePost(postId: string): Observable<DatabasePost | null> {
    return this.db
      .object<DatabasePost | null>(`posts/${postId}`)
      .valueChanges();
  }

  editPost(postId: string, editData: Partial<DatabasePost>) {
    const postRef = this.db.object<DatabasePost>(`posts/${postId}`);
    return postRef.update(editData);
  }

  deletePost(postId: string): Promise<[void, void]> {
    const postRef = this.db.object(`posts/${postId}`);
    const postDeletionPromise = postRef.remove();

    const commentsRef = this.db.object(`comments/${postId}`);
    const commentsDeletionPromise = commentsRef.remove();

    return Promise.all([postDeletionPromise, commentsDeletionPromise]);
  }

  getComments(commentId: string): Observable<DatabaseComment[]> {
    return this.db
      .list<DatabaseComment>(`comments/${commentId}`)
      .valueChanges();
  }
}
