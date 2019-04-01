import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class HeaderSearchService {
  public mySubject = new Subject<string>();
  public mySubject1 = new Subject<string>();
  public mySubject2 = new Subject<string>();
  public mySubject$ = this.mySubject.asObservable();
  public mySubject1$ = this.mySubject1.asObservable();
  public mySubject2$ = this.mySubject2.asObservable();

  constructor(private _http: Http) {
  }

  publishData(data) {
    this.mySubject.next(data);
  }

  publishMarkersData(data) {
    this.getData(data).then((data_from_api) => {
      if(!data_from_api[0].answer) {
        this.mySubject1.next(data_from_api);
        this.mySubject2.next(data);
      } else {
        this.mySubject1.next("error");
      }
    });
  }

  getData(query) {
    return this._http.get("http://apiportal.web14.com.ua/map_page_company_search?query=" + query)
     .toPromise()
     .then(res => this.extractData(res));
   }
 
   extractData(res: Response) {
     var data = res.json();
     return data;
   }
}