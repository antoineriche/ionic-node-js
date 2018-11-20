import { Component } from '@angular/core';
import { MyserverService } from '../../services/myserver/myserver.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ipAddressForm: FormGroup;
  userForm: FormGroup;
  dataForm: FormGroup;
  message:      string = "";

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
      data => console.log(data)
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
    this.myserver.postToServer(ip, data).subscribe(data => console.log(data));
  }

  getFavorite(){
    let ip      = this.ipAddressForm.value.ipAddress;
    let userId  = this.userForm.value.userId;
    this.myserver.getFavorite(ip, userId).subscribe( data => console.log(data));
  }
}
