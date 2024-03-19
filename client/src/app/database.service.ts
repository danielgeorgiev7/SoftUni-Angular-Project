import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { DatabaseUser } from './types/DatabaseUser';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  createUserNode(userId: string, userData: DatabaseUser) {
    return this.db.object(`users/${userId}`).set(userData);
  }

  getUserData(uid: string): Observable<any> {
    const userRef = this.db.object(`users/${uid}`);
    return userRef.valueChanges();
  }
}
