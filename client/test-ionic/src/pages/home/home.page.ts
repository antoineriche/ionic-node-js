import { Component } from '@angular/core';
import { MyserverService } from '../../services/myserver/myserver.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ipAddressForm:  FormGroup;
  userForm:       FormGroup;
  dataForm:       FormGroup;
  message:        string = "";
  usrPosts:       any[];
  sportPoints:    any[];
  allPosts:       any[];
  error:          string;

  constructor(
    private myserver: MyserverService,
    private formBuilder: FormBuilder){ }

  ngOnInit(){
    console.log('ngOnInit');
    this.ipAddressForm = this.formBuilder.group({
      'ipAddress' : ["192.168.1.91", [ Validators.required ] ],
    });

    this.userForm = this.formBuilder.group({
      'userId'  : ["12", [ Validators.required ] ]
    });

    this.dataForm = this.formBuilder.group({
      'message' : [this.message, [ Validators.required, Validators.minLength(3) ] ],
    });
  }

  myServerRequest(){
    let ip = this.ipAddressForm.value.ipAddress;
    this.myserver.checkServer(ip).subscribe(
      resp => {
        console.log(resp);
        if(resp.success){
          this.sportPoints = resp.data;
          this.allPosts = null;
          this.usrPosts = null;
        } else {
          this.error = resp.error.message;
        }
      }
    );
  }

  postToServer(){
    let ip      = this.ipAddressForm.value.ipAddress;
    let userId  = this.userForm.value.userId;
    let data = {
      message :  this.dataForm.value.message,
      date    :     new Date().getTime(),
      userId  :   userId
    }
    this.myserver.postToServer(ip, data).subscribe(resp => {
      console.log(resp);
      if(resp.success){
        this.dataForm.value.message = '';
      } else {
        this.error = resp.error.message;
      }
    });
  }

  getUserPosts(){
    let ip      = this.ipAddressForm.value.ipAddress;
    let userId  = this.userForm.value.userId;
    this.myserver.getUserPosts(ip, userId).subscribe(
      resp => {
        console.log(resp);
        if(resp.success){
          this.usrPosts = resp.data;
          this.allPosts = null;
          this.sportPoints = null;
        } else {
          this.error = resp.error.message;
        }
      }
    );
  }

  getAllPosts(){
    let ip      = this.ipAddressForm.value.ipAddress;
    this.myserver.getAllPosts(ip).subscribe(
      resp => {
        console.log(resp);
        if(resp.success){
          this.allPosts = resp.data;
          this.usrPosts = null;
          this.sportPoints = null;
        } else {
          this.error = resp.error.message;
        }
      }
    );
  }

  friendlyDate(date: number){
      return new DatePipe('en-US').transform(date, 'EEEE dd MMMM yyyy, HH:mm');
  }
}
