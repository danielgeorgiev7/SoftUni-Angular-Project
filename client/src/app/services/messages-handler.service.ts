import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesHandlerService {
  private currentMessage: BehaviorSubject<Message> =
    new BehaviorSubject<Message>({});

  addMessage(msg: Message) {
    this.currentMessage.next(msg);
  }

  get currentMessage$(): Observable<Message> {
    return this.currentMessage.asObservable();
  }
}
