import { Component } from '@angular/core';
import { MyserverService } from '../../services/myserver/myserver.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private myserver: MyserverService){ }

  ngOnInit(){
    console.log('ngOnInit');
    this.myserver.checkServer().subscribe(
      data => console.log(data)
    );
  }
}
