import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {LoginserviceService} from'./loginservice.service'
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginguardGuard implements CanActivate {

  constructor(private login:LoginserviceService,private router:Router)
  {}
  canActivate()
  { 
    let userdata=localStorage.getItem("facebookdata")
    console.log(userdata)
    if(userdata!==null)
    return true;
    else
    {
      this.router.navigate([''])
      return false;
    }
  }
   
}
