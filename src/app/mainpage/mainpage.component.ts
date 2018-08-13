import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring'
import { ChatserviceService } from '../chatservice.service';
import {ViewEncapsulation} from '@angular/core'
import { elementStyleProp } from '../../../node_modules/@angular/core/src/render3/instructions';
import {Renderer2} from '@angular/core';
import { BrowserDynamicTestingModule } from '../../../node_modules/@angular/platform-browser-dynamic/testing';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  encapsulation: ViewEncapsulation.None,
  
})
export class MainpageComponent implements OnInit {

  constructor(private googleauthservice: AuthService, private chatservice: ChatserviceService) 
  { 
    
  }

  sid: string;
  message: string;
  recievemessage: string
  channels: Array<string> = [];
  MessagesArray:Array<string>
  //member_name: string
  open_channel_id: string
  identity: string
  username: string
  bool: boolean
  messageinputbool: boolean
  inputchannelname: string
  searchresult:Array<string>
  searchkeyup:boolean
  text_to_search:string
  opened_channel:string




  ngOnInit() {
    let data = JSON.parse(localStorage.getItem('facebookdata'));

    this.identity = data.id;
    this.username = data.name;
    this.sid = localStorage.getItem('sid');

    console.log(this.identity);
    console.log(this.username);
    console.log(this.sid);
    this.ChannelList();

  }

 
  public OpenChannel(channel_name) {
    this.opened_channel=channel_name;
    document.getElementById("Container").innerHTML = "";
    let url = "" + this.sid + "/Channels/" + channel_name;
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {
      this.open_channel_id = data.sid;
      this.showMessages(data.sid);
      this.messageinputbool = true;

    });
  }

  public channelcreation() {
    this.bool=!this.bool ;
  }

  public createChannel() {

    let friendly_name = "sabha";
    let unique_name = this.inputchannelname;
    let sendURL = "" + this.sid + "/Channels"
    let body = new HttpParams()
      .set('FriendlyName', friendly_name).set('UniqueName', unique_name);
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => {
      console.log(data);
      this.JoinAChannel(unique_name);

    });
    //this.channels.push(unique_name);
    
    this.bool = false;
  }



  public JoinAChannel(channel_name) {
    let channel_id;

    let channel_url = "" + this.sid + "/Channels/" + channel_name;
    let channel_sub = this.chatservice.getapicall(channel_url);
    channel_sub.subscribe(data => {
      channel_id = data.sid;


      let sendURL = "" + this.sid + "/Channels/" + channel_id + "/Members";
      let body = new HttpParams().set('Identity', this.identity).set('FriendlyName', this.username).set('ServiceSid', this.sid).set('ChannelSid', channel_id);
      let subs = this.chatservice.postapicall(sendURL, body);
      subs.subscribe(data => console.log(data));
      this.channels.push(channel_name);

    });

  }

  public sendMessage() {
    let json={'Name':this.username};
    let sendURL = "" + this.sid + "/Channels/" + this.open_channel_id + "/Messages";
    let body = new HttpParams().set('ServiceSid', this.sid).set('ChannelSid', this.open_channel_id).set('Body', this.message).set('From',this.identity).set('Attributes',JSON.stringify(json));
    let subs = this.chatservice.postapicall(sendURL, body);
    subs.subscribe(data => console.log(data));
  }

  public showMessages(channel_id) {
    let message_count
    let message_sender

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
          //this.MessagesArray.push(element.body);
          let text = document.createElement("div");
          console.log("#"+element.from);
          if(element.from===this.identity)
          {
            text.setAttribute("class", "mybox");
          }
          else
          {
            text.setAttribute("class", "otherbox");
          }
          
         // text.setAttribute("style","")
         let name_span=document.createElement("span")
         //console.log(element.attributes);
         //let User=JSON.parse(element.attributes);
        //  let name=document.createTextNode(element.attributes);
        //   name_span.appendChild(name)
        //   text.appendChild(name_span)
          let t = document.createTextNode(element.body);
          text.appendChild(t);
          document.getElementById("Container").appendChild(text);
        });
       
      });


    });
      
    let ob = new Observable(observe => {
      setInterval(call => {

        let histsendURL = "" + this.sid + "/Channels/" + channel_id;

        let hist = this.chatservice.getapicall(histsendURL);
        hist.subscribe(next => {



          if (next.messages_count > message_count) {
            let subs = this.chatservice.getapicall(sendURL);
            subs.subscribe(data => {
              for (let i = message_count; i < next.messages_count; i++) {
                console.log(data.messages[i].body);
                //this.MessagesArray.push(data.messages[i].body);
                let text = document.createElement("div");
                if(data.messages[i].from===this.identity)
          {
            text.setAttribute("class", "mybox");
          }
          else
          {
            text.setAttribute("class", "otherbox");
          }
                let t = document.createTextNode(data.messages[i].body);
              //   let name_span=document.createElement("span")
              //   let User=JSON.parse(data.messages[i].attributes);
              //  let name=document.createTextNode(User.name);
                
              //   name_span.appendChild(name)
              //   text.appendChild(name_span)
                text.appendChild(t);
                document.getElementById("Container").appendChild(text);
              }
              message_count = next.messages_count
              
            });
          }
        });




      }, 2000)
    });

    ob.subscribe();



  }

  public ChannelList() {
    let url = "" + this.sid + "/Channels";
    let subs = this.chatservice.getapicall(url);
    subs.subscribe(data => {

      data.channels.forEach(element1 => {

        let searchURL = "" + this.sid + "/Channels/" + element1.sid + "/Members";
        let apihit = this.chatservice.getapicall(searchURL);
        apihit.subscribe(data => {
          data.members.forEach(element2 => {
            if (element2.identity === this.identity) {
              console.log(element1.unique_name);
              this.channels.push(element1.unique_name);
              console.log(this.channels);
            }

          });
        })

      });

    });
  }


  public ChannelSearch()
  {
      this.searchresult=[];
      if(this.text_to_search.length>=3)
      {

        let result:Array<string>=[];
    let url = "" + this.sid + "/Channels";
    let subs=this.chatservice.getapicall(url);
    subs.subscribe(data=> {

      let regex = new RegExp(this.text_to_search, "i");
      data.channels.forEach(element => {
        if (regex.test(element.unique_name)) {
        result.push(element.unique_name);
          console.log(element.unique_name);
      }
        
      });
     
      
      this.searchresult=result;
      console.log(this.searchresult);
    });
  }
  

}


}
