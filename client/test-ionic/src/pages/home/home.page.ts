import { Component } from '@angular/core';
import { MyserverService } from '../../services/myserver/myserver.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ipAddress: string = "192.168.1.91";

  constructor(private myserver: MyserverService){ }

  ngOnInit(){
    console.log('ngOnInit');
  }

  myServerRequest(){
    let ip = this.ipAddress;
    this.myserver.checkServer(ip).subscribe(
      data => console.log(data)
    );
  }
}
