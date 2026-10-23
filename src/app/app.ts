import { Component, signal } from '@angular/core';
import { Chat } from './components/chat';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  imports: [Chat],
})
export class App {
}
