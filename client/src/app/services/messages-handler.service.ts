import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesHandlerService {
  public currentMessage: BehaviorSubject<Message> =
    new BehaviorSubject<Message>({});

  // constructor(private messageService: MessageService) {}

  addMessage(msg: Message) {
    this.currentMessage.next(msg);
    console.log(this.currentMessage.value);
    console.log('from service');
  }
}
