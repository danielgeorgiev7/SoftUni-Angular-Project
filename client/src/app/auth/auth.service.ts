import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LocalUser } from './LocalUser.model';
import { DatabasePost } from '../types/DatabasePost';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<LocalUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private databaseService: DatabaseService,
    private afAuth: AngularFireAuth
  ) {}

  signUp(email: string, password: string, username: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const imageUrl = '/assets/profile-image-default.png';
        return userCredential.user
          ?.updateProfile({
            displayName: username,
            photoURL: imageUrl,
          })
          .then(() => {
            const user = userCredential.user;

            if (
              !user ||
              !user.email ||
              !user.metadata?.lastSignInTime ||
              !user.refreshToken ||
              !user.displayName ||
              !user.photoURL
            ) {
              return undefined;
            }

            this.handleLocalUser(
              user.email,
              user.uid,
              user.refreshToken,
              user?.metadata.lastSignInTime,
              user.displayName,
              user.photoURL
            );
            const userData = {
              userId: user.uid,
              email: user.email,
              username: user.displayName,
              imageUrl: user.photoURL,
              createdAt: user?.metadata.creationTime,
              bio: '',
            };
            return this.databaseService.createUserNode(user.uid, userData);
          });
      });
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (
          !user ||
          !user.email ||
          !user.metadata?.lastSignInTime ||
          !user.refreshToken ||
          !user.displayName ||
          !user.photoURL
        ) {
          return undefined;
        }
        this.handleLocalUser(
          user.email,
          user.uid,
          user.refreshToken,
          user?.metadata.lastSignInTime,
          user.displayName,
          user.photoURL
        );
      });
  }

  createPost(title: string, content: string, photoURL: string) {
    if (!this.user.value) return Promise.reject(new Error('User is undefined'));
    const timestamp = new Date();
    const postId = timestamp.getTime().toString();

    const postData: DatabasePost = {
      createdAt: timestamp.toString(),
      updatedAt: '',
      userId: this.user.value.id,
      username: this.user.value.username,
      userPhoto: this.user.value.imageUrl,
      attachedPhoto: photoURL || '',
      postId,
      title,
      content,
    };

    return this.databaseService.createPost(postData);
  }

  logout() {
    this.afAuth
      .signOut()
      .then(() => {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  handleLocalUser(
    email: string,
    userId: string,
    token: string,
    lastLoginTime: string,
    username: string,
    imageUrl: string
  ) {
    const user: LocalUser = {
      email,
      id: userId,
      token,
      tokenExpirationDate: new Date(
        new Date(lastLoginTime).getTime() + 60 * 60 * 1000
      ),
      username,
      imageUrl,
    };

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
