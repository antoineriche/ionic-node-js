import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {
    console.log('Hello SocketService');
  }

  registerForChatService(login: string) : void {
    console.log('registerForChatService');
    this.socket.connect();
    this.socket.emit('set-login', login);
  }

  retrieveMessages() : Observable {
    console.log('retrieveMessages');
    return new Observable((observer) => {
       this.socket.on('message', (data) => observer.next(data));
       this.socket.on('logged_in', (data) => observer.next(data));
    });
  }

  handleSocketError(): Observable {
    console.log('handleSocketError');
    return new Observable((observer) => {
       this.socket.on('chat-error', (error) => observer.next(error));
    });
  }

  sendMessage(message: string) : void {
    console.log('addMessage');
    this.socket.emit('message', message);
  }

  logOut() : void {
    console.log('logOut');
    this.socket.disconnect();
  }
}
