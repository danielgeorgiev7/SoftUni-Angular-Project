import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  createUserNode(userId: string, userData: any) {
    return this.db.object(`users/${userId}`).set(userData);
  }
}
