import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService,GoogleLoginProvider} from 'angular-6-social-login';
import { HttpHeaders, HttpClient,HttpParams } from '@angular/common/http';
import {stringify} from 'querystring'
import {ChatserviceService} from './chatservice.service'





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // querystring = require('querystring');
  sid:string;
                                                     
  
  constructor(private googleauthservice:AuthService,private chatservice:ChatserviceService)
  {}
  
  public googlesignin()
  {
    this.googleauthservice.signIn(GoogleLoginProvider.PROVIDER_ID).then
    (
      (userdata)=>{
        console.log("facebook"+" sign in data : " , userdata);
        localStorage.setItem("facebookdata",JSON.stringify(userdata));
      }
    );
    let url="https://chat.twilio.com/v2/Services"
    var subs=this.chatservice.getapicall(url);
    subs.subscribe(data=>{console.log(data.services[0].sid)
      this.sid=data.services[0].sid;
      console.log(this.sid);
    }
  );
  }
 
  public showChannel()
  {
    let url="https://chat.twilio.com/v2/Services/"+this.sid+"/Channels";
    var subs=this.chatservice.getapicall(url);
    subs.subscribe(data=>console.log(data));
  }
  
}