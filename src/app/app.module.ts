import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {GoogleLoginProvider,AuthServiceConfig, SocialLoginModule} from "angular-6-social-login";
import {HttpClientModule} from '@angular/common/http';

export function getAuthServiceConfigs()
{
  let config=new AuthServiceConfig(
[
 
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("1057590004565-b2cio2ce1fmuv8lhj7vdu91e5q0ad6j1.apps.googleusercontent.com")
    }

]

  );
    
  return config;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule

  ],
  providers: [{provide:AuthServiceConfig,
    useFactory:getAuthServiceConfigs
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
