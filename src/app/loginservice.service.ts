import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {

  constructor() { }

  isLoggedIn=false;
  isLogin()
  {
     return this.isLoggedIn;
  }
  setLogin(userdata)
  {
    
  }
  
}
