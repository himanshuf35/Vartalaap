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



  constructor(private googleauthservice: AuthService, private chatservice: ChatserviceService) { }

  public googlesignin() {
    this.googleauthservice.signIn(GoogleLoginProvider.PROVIDER_ID).then
      (
      (userdata) => {
        console.log("facebook" + " sign in data : ", userdata);
        localStorage.setItem("facebookdata", JSON.stringify(userdata));
      }
      );

    let url = "";
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {
      console.log(data.services[0].sid)
      this.sid = data.services[0].sid;
      console.log(this.sid);
      let userURL=""+this.sid+"/Users";
      let cuser=this.chatservice.getapicall(userURL);
      cuser.subscribe(data=>{
        let flag:boolean
        data.users.forEach(element => {
          

          if(element.identity==="112421427329768291872")
          {
              flag=true;
          }
          
        });
        if(!flag)
        {
               this.createUser();
        }
        else{
          console.log("user already exist");
        }

      })
    }
    );
    //this.createUser();
  }

  public OpenChannel(channel_name) {
    let url = "" + this.sid + "/Channels/"+channel_name;
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {
      this.showMessages(data.sid);

    });
  }

  public createChannel() {
    let friendly_name = "sabha";
    let unique_name = "panchayat5";
    let sendURL = "" + this.sid + "/Channels"
    let body = new HttpParams()
      .set('FriendlyName', friendly_name).set('UniqueName', unique_name);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
  }

  public createUser() {
    let identity = "112421427329768291872";
    let friendlyname = "himanshu";
    let sendURL = "" + this.sid + "/Users";
    let body = new HttpParams().set('Identity', identity).set('FriendlyName', friendlyname).set('ServiceSid', this.sid);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
  }

  public JoinAChannel() {
    let friendlyname = "himanshu";
    let identity = "112421427329768291872";
    let channel_id = "CH198e34fe5a314699990a2867939d0457";
    let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Members";
    let body = new HttpParams().set('Identity', identity).set('FriendlyName', friendlyname).set('ServiceSid', this.sid).set('ChannelSid', channel_id);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
  }

  public sendMessage() {
    let channel_id = "CH198e34fe5a314699990a2867939d0457";
    let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Messages";
    let body = new HttpParams().set('ServiceSid', this.sid).set('ChannelSid', channel_id).set('Body', this.message);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
  }

  public showMessages(channel_id) {
    let message_count
    //let channel_id= "CH198e34fe5a314699990a2867939d0457";
    let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Messages";
    let histsendURL = "" + this.sid + "/Channels/" + channel_id;
    let body = new HttpParams().set('ServiceSid', this.sid).set('ChannelSid', channel_id).set('Body', this.message);
    let hist = this.chatservice.getapicall(histsendURL);
    hist.subscribe(next => {
      message_count = next.messages_count
      console.log(message_count)
  
      let subs = this.chatservice.getapicall(sendURL);
        subs.subscribe(data => {
             data.messages.forEach(element => {
               console.log(element.body)
             });
        });


    });

    let ob = new Observable(observe => {
      setInterval(call => {
                
        let histsendURL = "" + this.sid + "/Channels/" + channel_id;

        let hist = this.chatservice.getapicall(histsendURL);
        hist.subscribe(next => {
          
          // console.log(next.messages_count)
          // console.log(message_count+"u")

          if(next.messages_count>message_count)
          {
            let subs = this.chatservice.getapicall(sendURL);
        subs.subscribe(data => {
         for(let i=message_count;i<next.messages_count;i++)
         {
           console.log(data.messages[i].body);
         }
         message_count=next.messages_count
        });
          }
        });
    


        
      }, 2000)
    });

    ob.subscribe();

    //console.log(message_count);

  }

  public ChannelList()
  {
    let url = "" + this.sid + "/Channels";
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data =>{
    
      data.channels.forEach(element1 => {

        let searchURL=""+this.sid+"/Channels/"+element1.sid+"/Members";
        let apihit=this.chatservice.getapicall(searchURL);
        apihit.subscribe(data=>
          {
            data.members.forEach(element2 => {
              if(element2.identity==="112421427329768291872")
              {
                console.log(element1.unique_name);
                this.channels.push(element1.unique_name);
                console.log(this.channels);
              }

            });
          })
        
      });

    } );
  }

}