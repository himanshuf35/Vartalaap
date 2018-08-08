import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService,GoogleLoginProvider} from 'angular-6-social-login';
import { HttpHeaders, HttpClient,HttpParams } from '@angular/common/http';
import {stringify} from 'querystring'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    'Authorization': 'Basic QUNjZWRhYTlkMDQ0ZWU3NmNkM2I2MDEwYmUzZDc2YWRhMzo4MWFiOTlhOWMyNDg2MDU1NTg5YjMwM2FjNmI5NjlmOQ=='
  })
};



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // querystring = require('querystring');
                                                     
    
  clientidentity:string='112421427329768291872';
  title = 'Vartalaap';
  Url="https://chat.twilio.com/v2/Services";
  constructor(private googleauthservice:AuthService,private http:HttpClient)
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
    var subs=this.apicall();
    subs.subscribe(data=>console.log(data));
  }
  data={FriendlyName:"Sabha"};
  public apicall():Observable<any>
  {
    const body = new HttpParams()
    .set('FriendlyName', 'Sabha');
    return this.http.post(this.Url,body.toString(),httpOptions)
    
  }
}