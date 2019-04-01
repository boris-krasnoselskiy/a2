import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class MapPageService {
  constructor(private _http: Http) {
  }

  getMapPageData(data = null) {
    let url = "http://apiportal.web14.com.ua/map_page"
    if(data) {
      url = "http://apiportal.web14.com.ua/map_page" + data;
    }
   return this._http.get(url)
        .toPromise()
        .then(res => this.extractData(res))
        .catch((err) => {
          alert("К сожалению сервер выдал ошибку");
      })
  }

  getCompanysData(query) {
   return this._http.get("http://apiportal.web14.com.ua/map_page_company_search?query=" + query)
        .toPromise()
        .then(res => this.extractData(res));
      }

  getOnePointData(id) {
    return this._http.get("http://apiportal.web14.com.ua/companies-point/point?id=" + id)
         .toPromise()
         .then(res => this.extractData(res));
   }

  getPointsData(id) {
    return this._http.get("http://apiportal.web14.com.ua/map_page?company_id=" + id)
         .toPromise()
         .then(res => this.extractData(res));
   }

  filterPointsData(value, id, searchParam = '') {
    var url = "http://apiportal.web14.com.ua/map_page?company_id=" + id + "&query=" + value;

    if(searchParam) {
      url = url + searchParam;
    }

    return this._http.get(url)
          .toPromise()
          .then((res) => 
          this.extractData(res));
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }
}
