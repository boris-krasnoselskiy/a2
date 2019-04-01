import { Component, OnInit } from '@angular/core';
import { OneNewsService } from 'app/services/one-news.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-one-news',
  templateUrl: './one-news.component.html',
  styleUrls: ['./one-news.component.scss']
})
export class OneNewsComponent implements OnInit {
  private path = this.url.path();
  private newsData;
  private openedWindow;

  getPointId() {
    let path = this.url.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
  }

  goToback() {
    var history = window.history;
    history.back();
  }

  shareInNetworks(name) {
    if(name == 'facebook') {
      this.openedWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + location.href, 'sharer', 'width=626, height=436');
    } else if(name == 'twitter') {
      this.openedWindow = window.open('http://twitter.com/share?url=' + location.href + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=438,width=600');
    }
  }

  constructor(
    public service: OneNewsService,
    private url: LocationStrategy
  ) {
    console.clear();
    this.newsData = this.service.getNewsData(this.getPointId());
  }

  ngOnInit() {
  }

}
