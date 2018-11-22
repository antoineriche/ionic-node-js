import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  login       :  string;
  isConnected :  boolean;
  pendingMsgs :  any[] = [];

  toggleConnection(connected: boolean){
    console.log('toggle: ' + connected);
    this.isConnected = connected;
    if(this.isConnected){
      this.reconnectToServer();
    }
  }

  constructor(private socket: Socket) {
    console.log('Hello SocketService');

    new Observable(observer => {
      this.socket.on('connect',     (data) => { console.log('connect');     observer.next(true); });
      this.socket.on('disconnect',  (data) => { console.log('disconnect');  observer.next(false); });
    }).subscribe( (connected) => this.toggleConnection(connected); );

    this.socket.on('connecting', function (err){
      console.log('connecting');
    });

    this.socket.on('connect_failed', function (err){
      console.log('connect_failed');
    });

    this.socket.on('error', function (err){
      console.log('error');
    });

    this.socket.on('reconnect', function (err){
      console.log('reconnect');
      this.isConnected = true;
    });

    this.socket.on('reconnecting', function (err){
      console.log('reconnecting');
    });

    this.socket.on('reconnect_failed', function (err){
      console.log('reconnect_failed');
    });
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

  handleSocketInfo(): Observable<any> {
    console.log('handleSocketInfo');
    return new Observable((observer) => {
       this.socket.on('chat-info', (info) => {
         if(info.type == 'new-chatter' && this.pendingMsgs.length > 0){
           console.log(this.pendingMsgs.length + ' msg to send');
           this.pendingMsgs.forEach((msg) => this.sendMessage(msg));
           this.pendingMsgs = [];
         }
         observer.next(info)
       });
    });
  }

  sendMessage(message: string): boolean {
    console.log('sendMessage');
    console.log('isConnected: ' + this.isConnected);
    if(this.isConnected){
      this.socket.emit('chat-message', message);
      return true;
    } else {
      this.pendingMsgs.push(message);
      return false;
    }
  }

  logOut() : void {
    console.log('logOut');
    this.socket.emit('log-out', '');
    this.isConnected = false;
    this.socket.disconnect();
  }
}
