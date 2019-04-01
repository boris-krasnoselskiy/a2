import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class SearchResultService {
  constructor(private _http: Http) {
  }

  getSearchResultData(isWorked, isNear, query) {
    var url = "http://apiportal.web14.com.ua/companies?query=" + query;

    if(isWorked) {
      url = url + "&work_now";
    } else if(isNear) {
      url = url + "&near";
    } else if(isWorked && isNear) {
      url = url + "&work_now&near";
    }
    
    return this._http.get(url)
         .toPromise()
         .then(res => this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
