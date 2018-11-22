import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: '../pages/home/home.module#HomePageModule' },
  { path: 'chat/:room/:login', loadChildren: '../pages/chat/chat.module#ChatPageModule' },
  { path: 'chatpicker', loadChildren: '../pages/chatpicker/chatpicker.module#ChatpickerPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
