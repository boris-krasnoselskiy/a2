import { Component, 
  OnInit, 
  style, 
  AfterViewInit } from '@angular/core';
import { Http, Response } from "@angular/http";
import { HomeService } from "app/services/home.service";
import * as $ from 'jquery';
import { SearchService } from 'app/services/search.service';
import { HeaderMapService } from 'app/services/header_map.service';
import { routerTransition } from 'app/router.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit, OnInit {
  isShowCompanyButton: boolean = true;
  isShowEventsButton: boolean = true;
  companyStorage:any[] = [];
  eventStorage:any[] = [];
  searchReq: any;
  companyPart: number = 0;  
  eventPart: number = 0;  
  companyData: Promise<any[]>;
  eventData: Promise<any[]>;

  constructor(
    private _http: Http, 
    private service: HomeService, 
    private searchService: SearchService,
    private serviceHeaderMap: HeaderMapService
  ) {
    // console.clear();
    this.service.getCompaniesData().then((data) => {
      this.companyStorage.push.apply(this.companyStorage, data[0].companies);
    });

    this.service.getEventsData().then((data) => {
      this.eventStorage.push.apply(this.eventStorage, data[0].news);
    });

    this.serviceHeaderMap.mySubject.subscribe(() => {
      this.companyPart = 0;
      setTimeout(() => {
        this.getCompaniesInitState();
        this.getEventsInitState();
      }, 500);
    });
  }

  public getMoreCompanies() {
    this.companyStorage = [];
    this.companyPart = this.companyPart + 1;
    this.service.getMoreCompanies(this.companyPart).then((data) => {
      console.log(data);
      this.companyStorage.push.apply(this.companyStorage, data[0].companies);
      this.initHoverAnimations();
      if(data[0].answer || !data[0].is_visible_button) {
        this.isShowCompanyButton = false;
      }
    });
  }

  public getCompaniesInitState() {
    this.companyStorage = [];
    this.service.getMoreCompanies(0).then((data) => {
      console.log(data);
      this.companyStorage.push.apply(this.companyStorage, data[0].companies);
      this.initHoverAnimations();
      if(data[0].answer || !data[0].is_visible_button) {
        this.isShowCompanyButton = false;
      }
    });
  }

  public getMoreEvents() {
    this.eventStorage = [];
    this.eventPart = this.eventPart + 1;
    this.service.getMoreEvents(this.eventPart).then((data) => {
      this.eventStorage.push.apply(this.eventStorage, data[0].news);
      this.initHoverAnimations();
      if(data[0].answer || !data[0].is_visible_button) {
        this.isShowEventsButton = false;
      }
    });
  }

  public getEventsInitState() {
    this.eventStorage = [];
    this.service.getMoreEvents(0).then((data) => {
      this.eventStorage.push.apply(this.eventStorage, data[0].news);
      this.initHoverAnimations();
      if(data[0].answer || !data[0].is_visible_button) {
        this.isShowEventsButton = false;
      }
    });
  }

  public getMoreEventItems(itemType) {
  }

  public getMoreCompanyItems(itemType) {
    this.companyData = this.service.getCompaniesData();
  }

  public initHoverAnimations() {
    setTimeout(() => {
      $(".company, .event").on("mouseenter", function() {
        var self = $(this);
    
        $(this).find(".shadow").stop(true).fadeIn();
        $(this).find(".about_text").stop(true).animate({
          height: "toggle"
        }, 200);

        $(this).find(".hovered")
               .stop(true)
               .animate({
                  opacity: 1,
                  top: "0",
                  height: "65px"
              }, 500)
              .show();
      });
    
      $(".company, .event").on("mouseleave", function() {
        var self = $(this);
    
        $(this).find(".hovered")
               .stop(true)
               .animate({
                  opacity: 0,
                  top: "-20px",
                  height: "toggle"
              }, 500)
        
        setTimeout(function() {
          self.find(".modal_call.second")
              .stop(true)
              .animate({
                opacity: 0,
                top: "-=20",
                height: "0"
              }, 500)
          }, 500);
    
        $(this).find(".shadow")
               .stop(true)
               .delay(500)
               .fadeOut("slow");

        $(this).find(".about_text")
               .stop(true)
               .delay(500)
               .fadeOut("fast");
      });
    }, 1000);
  }

  ngAfterViewInit() {
    this.initHoverAnimations();
  }

  ngOnInit() {
    this.companyData = this.service.getCompaniesData();
    this.eventData = this.service.getEventsData();
  }

}
