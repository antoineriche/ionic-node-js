import { Component } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Content } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

const COLORS = [
  {color: 'pink', code: "#E1BEE7"},
  {color: 'blue', code: "#BBDEFB"},
]

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  chatMsgs    : any[] = [];
  error       : any;
  login       : string;
  msgValid    : boolean = false;
  msgColor    : string;
  style       : any;
  chatMessage : any;
  room        : any;
  info        : any;
  timeoutInfo : any;
  timeoutErro : any;
  isConnected : boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    console.log('ngOnInit ChatPage');
    this.room = this.route.snapshot.paramMap.get('room');
    this.login = this.route.snapshot.paramMap.get('login');
    this.socketService.registerForChatService(this.login);

    this.socketService.retrieveMessages().subscribe(
      (data) => {
        this.chatMsgs.push(data);
        this.scrollToBottom(this.content);
      }
    );

    this.socketService.handleSocketInfo().subscribe(
      (info) => { this.displayInfo(info); this.isConnected = true; }
    );

    this.socketService.handleSocketError().subscribe(
      (error) => { this.displayError(error); }
    );

    let indexColor = Math.floor(Math.random() * (COLORS.length - 0)) + 0;
    this.msgColor = COLORS[indexColor].code;
    this.style = {'background-color': this.msgColor};
    console.log('indexColor: ' + indexColor);
  }

  sendMessage(){
    let msg = {
      content: {
        from: this.login,
        message: this.chatMessage,
        date: new Date().getTime()
      }
    }
    this.chatMsgs.push(msg);

    if(!this.socketService.sendMessage(this.chatMessage)){
      this.isConnected = false;
      this.displayError({type: "You're not connected."});
    }

    this.chatMessage = '';
    this.scrollToBottom(this.content);
  }

  scrollToBottom(content){
    setTimeout(() => content.scrollToBottom(), 100);
  }

  displayInfo(pInfo: any){
    this.info = pInfo.content;
    if(this.timeoutInfo){
      clearTimeout(this.timeoutInfo);
    }

    this.timeoutInfo = setTimeout(() => {
      this.info = null;
      this.timeoutInfo = null;
    }, 3000);
  }

  displayError(pError: any){
    this.error = pError;
    if(this.timeoutErro){
      clearTimeout(this.timeoutErro);
    }

    this.timeoutErro = setTimeout(() => {
      this.error = null;
      this.timeoutErro = null;
    }, 3000);
  }

  isValidMsg(){
    this.msgValid = this.chatMessage && this.chatMessage.trim();
    return this.msgValid;
  }

  friendlyDate(date: number){
    return new DatePipe('en-US').transform(date, 'HH:mm:ss');
  }

  back(){
    this.socketService.logOut();
    this.router.navigate(['chatpicker']);
  }

  isMe(msg){
    return msg.content.from == this.login;
  }

  // getStyle(msg){
  //   var defaultColor = this.isMe(msg) ? COLORS[0].code : COLORS[1].code;
  //   var position = this.isMe(msg) ? "right" : 'left';
  //   return {
  //     'background-color': msg.color ? msg.color : defaultColor,
  //     'float': position,
  //   }
  // }
}
