import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { DatabaseUser } from './types/DatabaseUser';
import { DatabasePost, DatabasePostData } from './types/DatabasePost';
import { DatabaseComment, DatabaseCommentData } from './types/DatabaseComment';

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
    return this.db.object(`posts/${postData.data.postId}`).set(postData);
  }

  createComment(commentData: DatabaseComment) {
    return this.db
      .object(
        `comments/${commentData.data.postId}/${commentData.data.commentId}`
      )
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

  editPost(postId: string, editData: Partial<DatabasePostData>) {
    return this.db
      .object<DatabasePostData>(`posts/${postId}/data`)
      .update(editData);
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

  editComment(
    postId: string,
    commentId: string,
    editData: Partial<DatabaseCommentData>
  ) {
    const comRef = this.db.object<DatabaseCommentData>(
      `comments/${postId}/${commentId}/data`
    );
    return comRef.update(editData);
  }

  deleteComment(postId: string, commentId: string): Promise<void> {
    return this.db.object(`comments/${postId}/${commentId}`).remove();
  }

  addLike(
    targetType: 'post' | 'comment',
    userId: string,
    postId: string,
    commentId?: string
  ) {
    const url =
      targetType === 'post'
        ? `/posts/${postId}/likes/${userId}`
        : `/comments/${postId}/${commentId}/likes/${userId}`;

    return this.db.object(url).set(true);
  }

  removeLike(
    targetType: 'post' | 'comment',
    userId: string,
    postId: string,
    commentId?: string
  ) {
    const url =
      targetType === 'post'
        ? `/posts/${postId}/likes/${userId}`
        : `/comments/${postId}/${commentId}/likes/${userId}`;

    return this.db.object(url).remove();
  }
}
