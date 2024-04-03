import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LocalUser } from '../types/LocalUser';
import { MessagesHandlerService } from '../services/messages-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<LocalUser | null>(null);

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private databaseService: DatabaseService,
    private messageHandlerService: MessagesHandlerService
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
              favoriteMovie: '',
            };

            return this.databaseService.createUserNode(user.uid, userData);
          })
          .then(() => {
            this.messageHandlerService.addMessage({
              severity: 'success',
              summary: 'Success!',
              detail: 'Logged in successfully',
              life: 5000,
            });
          })
          .catch((error) => {
            let errorMessage: string;
            if (error instanceof Error) {
              errorMessage = error.message;
            } else {
              errorMessage = 'An error occurred while registering.';
            }

            this.messageHandlerService.addMessage({
              severity: 'error',
              summary: 'Register Error:',
              detail: errorMessage,
              life: 5000,
            });
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

        this.messageHandlerService.addMessage({
          severity: 'success',
          summary: 'Success!',
          detail: 'Logged in successfully',
          life: 5000,
        });
      })
      .catch((error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while logging in.';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Login Error:',
          detail: errorMessage,
          life: 5000,
        });
      });
  }

  logout() {
    this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/home']);
        localStorage.removeItem('userData');
        this.user.next(null);
        this.messageHandlerService.addMessage({
          severity: 'success',
          summary: 'Success!',
          detail: 'Logged out successfully',
          life: 5000,
        });
      })
      .catch((error) => {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred while logging out.';
        }

        this.messageHandlerService.addMessage({
          severity: 'error',
          summary: 'Logout Error:',
          detail: errorMessage,
          life: 5000,
        });
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

  async updateUserPhoto(userId: string, imageUrl: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user
        .updateProfile({
          photoURL: imageUrl,
        })
        .then(() => {
          if (
            !user.email ||
            !user.metadata?.lastSignInTime ||
            !user.refreshToken ||
            !user.displayName
          ) {
            this.messageHandlerService.addMessage({
              severity: 'error',
              summary: 'Error:',
              detail: 'User is not signed in. Try signing in again.',
              life: 5000,
            });
            return;
          }
          this.handleLocalUser(
            user.email,
            user.uid,
            user.refreshToken,
            user.metadata?.lastSignInTime,
            user.displayName,
            imageUrl
          );
          this.databaseService.changeImage(userId, imageUrl);
        })
        .catch((error) => {
          let errorMessage: string;
          if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = 'An error occurred while logging out.';
          }

          this.messageHandlerService.addMessage({
            severity: 'error',
            summary: 'Error:',
            detail: errorMessage,
            life: 5000,
          });
        });
    } else {
      this.messageHandlerService.addMessage({
        severity: 'error',
        summary: 'Error:',
        detail: 'User is not signed in. Try signing in again.',
        life: 5000,
      });
      return Promise.reject('User is not signed in.');
    }
  }
}
