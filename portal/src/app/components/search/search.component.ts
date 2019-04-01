import { Component, AfterViewInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { SearchResultService } from 'app/services/search_result.service';
import { HeaderSearchService } from 'app/services/header_search.service';
import { Router, NavigationEnd } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  queryIsWorkedNow: boolean = false;
  queryIsNear: boolean = false;
  isShowButton: boolean = false;
  searchResultData: any;
  temp: any;
  searchReq: any = "search";

  goToback() {
    const history = window.history;
    history.back();
  }

  getSearchQuery() {
    var path = this.url.path();
    var query = path.substr(path.lastIndexOf('/') + 1);
    this.searchReq = decodeURI(query);
    var isWorkNow = path.lastIndexOf('work_now');
    var isNear = path.lastIndexOf('near');

    if(isWorkNow > 0) {
      this.queryIsWorkedNow = true;
      if(isNear > 0) {
        this.queryIsNear = true;
      }
    } else if(isNear > 0) {
      this.queryIsNear = true;
    }
    return query;
  }

  getResources() {
    this.searchResultData = this.service.getSearchResultData(
      this.queryIsWorkedNow, this.queryIsNear, this.getSearchQuery()
    );

    this.searchResultData.then((data) => {
      this.temp = data[0].answer;
    });
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }

  constructor(
    private router: Router,
    private _http: Http,
    private url: LocationStrategy,
    private service: SearchResultService,
    private header_search: HeaderSearchService
  ) {
    this.getResources();
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.getResources();
      }
    });
  }

}
