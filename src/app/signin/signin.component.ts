import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring'
import { ChatserviceService } from '../chatservice.service';
import {Router} from '@angular/router'
import {LoginserviceService} from '../loginservice.service';
import {ViewEncapsulation} from '@angular/core'


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {

  sid: string;
  message: string;
  recievemessage: string
  channels:Array<string>=[];
  member_name:string
  open_channel_id:string
  identity:string
  username:string

  constructor(private googleauthservice: AuthService, private chatservice: ChatserviceService,private router:Router,private login:LoginserviceService) { }

  ngOnInit() {
    if(localStorage.getItem("facebookdata"))
    {
      this.router.navigate(['/mainpage'])
    }
  }

  public googlesignin() {
    this.googleauthservice.signIn(GoogleLoginProvider.PROVIDER_ID).then
      (
      (userdata) => {
        console.log(userdata);
        console.log("facebook" + " sign in data : ", userdata.id.toString());
        this.chatservice.setID(userdata.id.toString());
        this.chatservice.setUsername(userdata.name.toString());
        this.identity=userdata.id.toString();
        this.username=userdata.name.toString();
        console.log(this.identity);
        console.log(this.username);
        //this.login.setLogin(userdata);

        localStorage.setItem("facebookdata", JSON.stringify(userdata));
        //this.router.navigate(['/mainpage']);
        let url = "";
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {
      console.log(data.services[0].sid)
      this.sid = data.services[0].sid;
      localStorage.setItem("sid",this.sid);
      console.log(this.sid);
      let userURL=""+this.sid+"/Users";
      let cuser=this.chatservice.getapicall(userURL);
      cuser.subscribe(data=>{
        let flag:boolean=false;
        data.users.forEach(element => {
          

          if(element.identity===this.identity)
          {
              flag=true;
          }
          
        });
        console.log(flag);
        
        if(!flag)
        {
               this.createUser();
        }
        else{
          this.router.navigate(['/mainpage']);
          console.log("user already exist");
        }
        
         
      })
    }
    
    );


      }
      );

    
    //this.createUser();
    
  }

  public createUser() {
    //let identity = "112421427329768291872";
    //let friendlyname = "himanshu";
    let sendURL = "" + this.sid + "/Users";
    let body = new HttpParams().set('Identity', this.identity).set('FriendlyName', this.username).set('ServiceSid', this.sid);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => {
      console.log(data)

      let channel_id;
      let channel_name="General"

      let channel_url = "" + this.sid + "/Channels/" + channel_name;
      let channel_sub = this.chatservice.getapicall(channel_url);
      channel_sub.subscribe(data => {
      channel_id = data.sid;


      let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Members";
      let body = new HttpParams().set('Identity', this.identity).set('FriendlyName', this.username).set('ServiceSid', this.sid).set('ChannelSid', channel_id);
      let subs = this.chatservice.postapicall(sendURL, body);
      subs.subscribe(data => console.log(data));
      this.router.navigate(['/mainpage']);
      //this.channels.push(channel_name);

    });
    
    });
  }

}
