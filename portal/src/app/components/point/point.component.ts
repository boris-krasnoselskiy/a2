import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { PointService } from 'app/services/point.service';
import { NgxCarousel } from 'ngx-carousel';
import { Router } from '@angular/router';
import { CompanyHeaderService } from 'app/services/company_header.service';
import { PointMapService } from 'app/services/point-map.service';
import { HeaderCompanyService } from 'app/services/header_company.service';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  private pointData: any;
  private openedWindow: any;
  private search_body: any;
  private isCollapsedContent = true;
  private isPointInfoShowed = false;
  private path = this.url.path();
  private carouselOne: NgxCarousel;
  private isVisibleButton: boolean = false;
  
  constructor(
    private router: Router,
    private service: PointService,
    private point_map_serv: PointMapService,
    private companyHeaderServ: CompanyHeaderService,
    private headerCompanyServ: HeaderCompanyService,
    private url: LocationStrategy
  ) {
    console.clear();
    this.pointData = this.service.getPointData(this.getPointId());
    this.pointData.then((data) => {
      if(data[0].comments.lenght > 10) {
        this.isVisibleButton = true;
      }
    });

    this.headerCompanyServ.mySubject.subscribe((data) => {
      this.search_body = data;
    })
  
  }

  checkVar(arg) {
    console.log(this.search_body + " " + arg);
  }

  shareInNetworks(name) {
    if(name == 'facebook') {
      this.openedWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + location.href, 'sharer', 'width=626, height=436');
    } else if(name == 'twitter') {
      this.openedWindow = window.open('http://twitter.com/share?url=' + location.href + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=438,width=600');
    }
  }

  toggleCollapse() {
    if(this.isCollapsedContent) {
      return "90px";
    } else {
      return "auto";
    }
  }

  getPointId() {
    let path = this.url.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
  }

  backToMap() {
    this.router.navigateByUrl('/map_page/point/' + this.getPointId());
    this.companyHeaderServ.mySubject.next(true);
  }

  goToback() {
    var history = window.history;
    history.back();
    if(this.search_body) {
      this.companyHeaderServ.mySubject.next(true);
      this.point_map_serv.publishData(this.search_body);
    }
  }

  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 800,
      interval: 4000,
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }
}