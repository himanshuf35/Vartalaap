import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService,GoogleLoginProvider} from 'angular-6-social-login'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vartalaap';
  constructor(private googleauthservice:AuthService)
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
  }
 
}
