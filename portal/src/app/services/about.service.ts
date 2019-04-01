import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class AboutService {
  constructor(private _http: Http) {
  }

  getAboutData() {
    return this._http.get("assets/api/about.json")
         .toPromise()
         .then(res => this.extractData(res));
   }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
