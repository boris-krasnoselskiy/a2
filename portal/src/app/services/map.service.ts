import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class MapService {
  constructor(private _http: Http) {
  }

  getMapData() {
   return this._http.get("http://apiportal.web14.com.ua/map")
        .toPromise()
        .then(res => this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
