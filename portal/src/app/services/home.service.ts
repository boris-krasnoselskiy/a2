import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class HomeService {
  constructor(private _http: Http) {
  }

  getCompaniesData() {
   return this._http.get("http://apiportal.web14.com.ua/companies")
        .toPromise()
        .then(res => this.extractData(res));
  }

  getEventsData() {
    return this._http.get("http://apiportal.web14.com.ua/news")
         .toPromise()
         .then(res => this.extractData(res));
  }

  getMoreCompanies(part) {
    return this._http.get("http://apiportal.web14.com.ua/companies?part=" + part)
         .toPromise()
         .then(res => this.extractData(res));
  }

  getMoreEvents(part) {
    return this._http.get("http://apiportal.web14.com.ua/news?part=" + part)
        .toPromise()
        .then(res => this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
