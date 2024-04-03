import { Component, OnDestroy, OnInit } from '@angular/core';
import { MoviesApiService } from './services/movies-api.service';
import { AuthService } from './auth/auth.service';
import { MessagesHandlerService } from './services/messages-handler.service';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  currentMessageSub: Subscription = new Subscription();
  messageObserverSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private messagesHandlerService: MessagesHandlerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentMessageSub =
      this.messagesHandlerService.currentMessage$.subscribe((message) => {
        this.messageService.add(message);
      });

    this.messageObserverSub = this.messageService.messageObserver.subscribe(
      (message) => {
        if (Array.isArray(message)) {
          this.messages = message;
        } else {
          this.messages = [message];
        }
      }
    );

    const userData = localStorage.getItem('userData');
    if (!userData) return;
    this.authService.user.next(JSON.parse(userData));
  }

  ngOnDestroy(): void {
    this.currentMessageSub.unsubscribe();
    this.messageObserverSub.unsubscribe();
  }
}
