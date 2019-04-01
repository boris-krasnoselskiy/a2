import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { Router } from "@angular/router";

@Injectable()
export class FeedbackService {
  public result;

  constructor(
    private _http: Http,
    private router: Router
  ) 
  {
  }

  getFeedbackData(id) {
    return this._http.get("http://apiportal.web14.com.ua/point?id=" + id)
          .toPromise()
          .then(res => this.extractData(res));
  }

  postFormValue(obj) {
    // console.log(obj);
    let headers = new Headers({ "content-type": "application/x-www-form-urlencoded; charset=UTF-8" });
    let options = new RequestOptions({ 
      // headers: headers,
      withCredentials: false 
    });

    // const req = this._http.post("http://apiportal.web14.com.ua/feedback", obj, options);
    // req.subscribe();
    this._http.post("http://apiportal.web14.com.ua/feedback", obj, options)
              .toPromise()
              .then(res => {
                let result = this.extractData(res);
                if(result[0].answer) {
                  this.router.navigateByUrl('/success');
                }
              });
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
