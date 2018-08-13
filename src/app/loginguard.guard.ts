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
    let userdata=localStorage.getItem("facebookdata")
    console.log(userdata)
    if(userdata!==null)
    return true;
    else
    return false;
  }
   
}
