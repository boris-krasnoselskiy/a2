import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { AboutService } from 'app/services/about.service';
import { routerTransition } from 'app/router.animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  private path = this.url.path();
  private aboutData;

  goToback() {
    var history = window.history;
    history.back();
  }

  constructor(
    public service: AboutService,
    private url: LocationStrategy
  ) {
    this.aboutData = this.service.getAboutData();
  }

  ngOnInit() {
  }

}
