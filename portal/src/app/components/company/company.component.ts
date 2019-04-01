import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { CompanyService } from 'app/services/company.service';
import { NgxCarousel } from 'ngx-carousel';
import { HeaderCompanyService } from 'app/services/header_company.service';
import { PointMapService } from 'app/services/point-map.service';
import { CompanyHeaderService } from 'app/services/company_header.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  private companyData: any;
  private isCollapsedContent = true;
  private isCompanyInfoShowed = false;
  private isCompanyOficeShowed = false;
  private path = this.url.path();
  private search_body: any;
  private openedWindow: any;
  public carouselOne: NgxCarousel;
  public carouselTwo: NgxCarousel;
  
  constructor(
    private service: CompanyService,
    private point_map_serv: PointMapService,
    private companyHeaderServ: CompanyHeaderService,
    private headerCompanyServ: HeaderCompanyService,
    private url: LocationStrategy
  ) {
    this.companyData = this.service.getCompanyData(this.getPointId());
  }

  goToback() {
    var history = window.history;
    history.back();
  }

  toMapPage() {

  }

  toggleCollapse() {
    if(this.isCollapsedContent) {
      return "190px";
    } else {
      return "auto";
    }
  }

  shareInNetworks(name) {
    if(name == 'facebook') {
      this.openedWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + location.href, 'sharer', 'width=626, height=436');
    } else if(name == 'twitter') {
      this.openedWindow = window.open('http://twitter.com/share?url=' + location.href + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=438,width=600');
    }
  }

  getPointId() {
    var path = this.url.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
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

    this.carouselTwo = {
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

