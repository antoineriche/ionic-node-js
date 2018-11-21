import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { ViewChild, ElementRef } from '@angular/core';
import { NavController, Content, List } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(Content) content: Content;
  chatMsgs: any[] = [];
  error:    any;
  // mutationObserver: MutationObserver;

  constructor(
    private socketService: SocketService) { }

  ngOnInit() {
    console.log('ngOnInit ChatPage');
    this.socketService.retrieveMessages().subscribe(
      (data) => {
        console.log(data);
        this.chatMsgs.push(data);
        this.content.scrollToBottom();
      }
    );
    this.socketService.handleSocketError().subscribe(
      (error) => this.error = {message: error}
    );
  }

  sendMessage(){
    this.error = null;
    this.socketService.sendMessage(this.chatMessage);
    this.chatMsgs.push({from: this.nickname, content: this.chatMessage});
    this.chatMessage = '';
    this.content.scrollToBottom();
  }

  joinChat(){
    this.socketService.registerForChatService(this.nickname);
  }
}
