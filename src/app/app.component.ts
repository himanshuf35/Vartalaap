import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring'
import { ChatserviceService } from './chatservice.service';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // querystring = require('querystring');
  sid: string;
  message: string;
  recievemessage: string
  channels:Array<string>=[];
  member_name:string
  open_channel_id:string
  identity:string
  username:string



  constructor(private googleauthservice: AuthService, private chatservice: ChatserviceService) { }


  

}