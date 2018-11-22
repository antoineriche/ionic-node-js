import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatpicker',
  templateUrl: './chatpicker.page.html',
  styleUrls: ['./chatpicker.page.scss'],
})
export class ChatpickerPage {

  chatRooms: any[] = [
    {name: 'Noobs room', description: 'Chat for noobs', id: 'noobs'},
    {name: 'Good boys room', description: 'Chat for good boys', id: 'goodboys'},
    {name: 'Bad guys room', description: 'Chat for bad guys', id: 'badguys'},
  ];
  loginValid: boolean = false;
  nickname: string;

  constructor(private router: Router) { }

  isValidLogin(){
    this.loginValid = this.nickname && this.nickname.trim() != '';
  }

  joinRoom(roomId: string){
    this.router.navigate(['chat', roomId, this.nickname]);
  }

}
