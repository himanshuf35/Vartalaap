import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router'

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {GoogleLoginProvider,AuthServiceConfig, SocialLoginModule} from "angular-6-social-login";
import {HttpClientModule} from '@angular/common/http';
import { SigninComponent } from './signin/signin.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import {LoginguardGuard} from './loginguard.guard'
//import {Renderer2} from '@angular/core';


const routes:Routes=[
  {path:'',
  component:SigninComponent
},
{
  path:'signin',
  component:SigninComponent
},
{
  path:'mainpage',
  component:MainpageComponent,
  // canActivate:[LoginguardGuard]
}

]
 
export function getAuthServiceConfigs()
{

  
  let config=new AuthServiceConfig(
[
 
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("1057590004565-ag4u4fg5tjoetsbto7gg52r48rvo9o6s.apps.googleusercontent.com")
    }

]

  );
    
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    MainpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    RouterModule.forRoot(routes),
    
    

  ],
  providers: [{provide:AuthServiceConfig,
    useFactory:getAuthServiceConfigs
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
