import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class OneNewsService {
  constructor(private _http: Http) {
  }

  getNewsData(id) {
   return this._http.get("http://apiportal.web14.com.ua/news?id=" + id)
        .toPromise()
        .then(res => this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
