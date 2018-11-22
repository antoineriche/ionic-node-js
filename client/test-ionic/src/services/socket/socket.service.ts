import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  login       :  string;

  constructor(private socket: Socket) {
    console.log('Hello SocketService');
  }

  registerForChatService(login: string) : void {
    console.log('registerForChatService');
    this.login = login;
    this.socket.connect();
    this.socket.emit('chat-login', login);
  }

  reconnectToServer(){
    console.log('reconnectToServer');
    this.socket.emit('chat-login', this.login);
  }

  retrieveMessages() : Observable<any> {
    console.log('retrieveMessages');
    return new Observable((observer) => {
       this.socket.on('chat-message', (data) => observer.next(data));
    });
  }

  handleSocketError(): Observable<any> {
    console.log('handleSocketError');
    return new Observable((observer) => {
       this.socket.on('chat-error', (error) => observer.next(error));
    });
  }

  isConnected(): Observable<boolean> {
    return new Observable((observer) => {
      this.socket.on('connect', (data) => { observer.next(true); });
      this.socket.on('disconnect', (data) => { observer.next(false); });
    });
  }

  handleSocketInfo(): Observable<any> {
    console.log('handleSocketInfo');
    return new Observable((observer) => {
       this.socket.on('chat-info', (info) => observer.next(info) );
    });
  }

  sendMessage(message: string) {
    console.log('sendMessage');
    this.socket.emit('chat-message', message);
  }

  logOut() : void {
    console.log('logOut');
    this.socket.emit('log-out', '');
    this.socket.disconnect();
  }
}
