import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {LoginserviceService} from'./loginservice.service'

@Injectable({
  providedIn: 'root'
})
export class LoginguardGuard implements CanActivate {

  constructor(private login:LoginserviceService)
  {}
  canActivate()
  { 
    if(this.login.isLogin())
    return true;
    else
    return false;
  }
   
}
