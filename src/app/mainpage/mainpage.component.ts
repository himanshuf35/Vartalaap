import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring'
import { ChatserviceService } from '../chatservice.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private googleauthservice: AuthService, private chatservice: ChatserviceService) { }

  sid: string;
  message: string;
  recievemessage: string
  channels:Array<string>=[];
  member_name:string
  open_channel_id:string
  identity:string
  username:string
  bool:boolean
  inputchannelname:string


  

  ngOnInit() {
    let data=JSON.parse(localStorage.getItem('facebookdata'));
    
    this.identity=data.id;
    this.username=data.name;
    this.sid=localStorage.getItem('sid');

   console.log(this.identity);
   console.log(this.username);
   console.log(this.sid);
   this.ChannelList();
   //console.log(this.chatservice.getUsername());
    
  }
  public OpenChannel(channel_name) {
    document.getElementById("container").innerHTML="";
    let url = "" + this.sid + "/Channels/"+channel_name;
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {
      this.open_channel_id=data.sid;
      this.showMessages(data.sid);

    });
  }

  public channelcreation()
  {
    // let text = document.createElement("INPUT");
    // text.setAttribute("id","createchannel")
    // text.setAttribute("type","text");
    // text.setAttribute("placeholder","Channel Name");
    //           //  let t = document.createTextNode(element.body);
    //           //  text.appendChild(t);
    // document.body.appendChild(text);
    this.bool=true;
    //this.createChannel();
  }

  public createChannel() {
    
    let friendly_name = "sabha";
    let unique_name = this.inputchannelname;
    let sendURL = "" + this.sid + "/Channels"
    let body = new HttpParams()
      .set('FriendlyName', friendly_name).set('UniqueName', unique_name);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
    this.channels.push(unique_name);
    this.bool=false;
  }

  

  public JoinAChannel() {
    let channel_id;

    let channel_url = "" + this.sid + "/Channels/"+this.member_name;
    let channel_sub = this.chatservice.getapicall(channel_url);
    channel_sub.subscribe(data => {
    channel_id=data.sid;
    //let friendlyname = "himanshu";
    //let identity = "112421427329768291872";
    
    let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Members";
    let body = new HttpParams().set('Identity', this.identity).set('FriendlyName', this.username).set('ServiceSid', this.sid).set('ChannelSid', channel_id);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
    this.channels.push(this.member_name);

    });
    
  }

  public sendMessage() {
    //let channel_id = "CH198e34fe5a314699990a2867939d0457";
    let sendURL = "" + this.sid + "/Channels/" + this.open_channel_id + "/Messages";
    let body = new HttpParams().set('ServiceSid', this.sid).set('ChannelSid', this.open_channel_id).set('Body', this.message);
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
               let text = document.createElement("DIV");
               text.setAttribute("class","textbox");
               let t = document.createTextNode(element.body);
               text.appendChild(t);
               document.getElementById("container").appendChild(text);
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
           let text = document.createElement("DIV");
               let t = document.createTextNode(data.messages[i].body);
               text.appendChild(t);
               document.getElementById("container").appendChild(text);
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
              if(element2.identity===this.identity)
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