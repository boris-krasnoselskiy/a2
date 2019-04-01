import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions } from "@angular/http";
import "rxjs/Rx";
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Injectable()
export class BecomeService {

  constructor(
    private _http: Http,
    private router: Router
  ) {

  }

  postTextData(obj) {
    var name = obj.name,
        phone = obj.phone,
        email = obj.email,
        target = obj.target,
        result;

    this._http.get('http://apiportal.web14.com.ua/forms?name=' 
        + name + '&email=' + email + '&phone=' + phone + '&target=' + target)
        .toPromise()
        .then((res) => {
          result = this.extractData(res);
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
