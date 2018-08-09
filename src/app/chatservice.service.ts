import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL="https://chat.twilio.com/v2/Services/";
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
  public postapicall(getURL:string,body:HttpParams): Observable<any> {
    let URL=baseURL+getURL;
    console.log(URL)
    return this.http.post(URL, body.toString(), httpOptions)
    //console.log(URL);

  }

  //function for get apicall
  public getapicall(getURL:string): Observable<any> {
    let URL=baseURL+getURL
    return this.http.get(URL, httpOptions);
  }

  // public CreateUserapicall()
  // {
  //   url=
  //   return this.http.post()
  // }

}
