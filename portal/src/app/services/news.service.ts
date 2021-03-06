import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class NewsService {

  constructor(private _http: Http) {
  }

  getNewsData() {
   return this._http.get("http://apiportal.web14.com.ua/news")
        .toPromise()
        .then(res => this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }

}

