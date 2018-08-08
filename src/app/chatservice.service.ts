import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic QUNjZWRhYTlkMDQ0ZWU3NmNkM2I2MDEwYmUzZDc2YWRhMzo4MWFiOTlhOWMyNDg2MDU1NTg5YjMwM2FjNmI5NjlmOQ=='
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  constructor(public http: HttpClient) { }

  clientidentity: string = '112421427329768291872';
  title = 'Vartalaap';
  deleteURL = "https://chat.twilio.com/v2/Services/ISd7793e31931e44eebe1e1d0e3dcf0080";
  Url = "https://chat.twilio.com/v2/Services";

  //function for post apicall 
  public postapicall(): Observable<any> {
    const body = new HttpParams()
      .set('FriendlyName', 'Sabha').set('UniqueName','panchayat2');
    return this.http.post(this.Url, body.toString(), httpOptions)

  }

  //function for get apicall
  public getapicall(getURL:string): Observable<any> {
    return this.http.get(getURL, httpOptions);
  }

  // public CreateUserapicall()
  // {
  //   url=
  //   return this.http.post()
  // }

}
