import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderService } from "app/services/header.service";
import { Http, Response } from "@angular/http";
import { HeaderSearchService } from 'app/services/header_search.service';
import { HeaderMapService } from 'app/services/header_map.service';
import { Router, NavigationEnd } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { CompanyHeaderService } from 'app/services/company_header.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { HeaderCompanyService } from 'app/services/header_company.service';
import { HeaderSideMapService } from 'app/services/header_side_map.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('menuSlideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(120%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('rubricSlideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(120%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public allRubrics: Promise<any>;
  public navigation: any;
  public currentComponent;
  public path = this.url.path();
  public activeComponent;
  public selected_region: any;
  public rubricData: any;
  public regionIsSelected: boolean = false;
  public rubricContentIsOpen: boolean = false;
  public regionsWindowIsOpen: boolean = false;
  public isAllrubricsMobile: boolean = false;
  public rubricIsOpen: boolean = false;
  public hasNewPlace: boolean = false;
  public rubricsIsLoaded: boolean = false;
  public headerData: Promise<any[]>;
  public rubricsData: Promise<any>;
  public regionsData: Promise<any[]>;
  public someData: Promise<any[]>;
  public counter: number;
  public timer: any;
  public inputValue: string = "";
  public showCityPopup;
  public set_place;
  public newPlace;
  public navToggle: boolean = false;
  public menuState:string = 'out';
  public rubricState:boolean = false;
  public rubricIsActive:boolean = false;
  public nestedRubricIsActive:boolean = false;
  public showRubricCloseBtn:boolean = false;
  public searchCheckboxValue: boolean = false;
  public allRubricsOpen: boolean = false;
  public search_text;
  public near_checkbox;
  public open_checkbox;

  constructor(
    private scrollbarService: MalihuScrollbarService, 
    private url: LocationStrategy,
    private router: Router,
    private companyHeaderServ: CompanyHeaderService,
    private headerSideMapServ: HeaderSideMapService,
    private headerCompanyServ: HeaderCompanyService,
    private service: HeaderService,
    private headerSearchService: HeaderSearchService, 
    private headerMapService: HeaderMapService, 
    private _http: Http,
    private serviceHeaderMap: HeaderMapService) {

      this.companyHeaderServ.mySubject.subscribe(() => {
        this._http.get("http://apiportal.web14.com.ua/companies?query="
        + "рога").toPromise();
        this.headerMapService.mySubject.next(true);
      });

      router.events.subscribe(() => {
        this.currentComponent = this.path.substr(this.path.lastIndexOf('/') + 1);
        this.hideMenu();
        this.hideRubrics();
        if(this.search_text) {
          localStorage.setItem('req', this.search_text);
          this.headerCompanyServ.publishData(this.search_text);
        }
      });

      router.events.forEach((event) => {
        if(event instanceof NavigationEnd) {
          var url = window.location.toString();
          var ar = url.split('/');
          this.activeComponent = ar[ar.length-1];
        }
      });
    }

  
  clearInput() {
    this.inputValue = null;
  }

  search(search_body, isOpened, isBeside) {
  }

  showRubricsPopup() {
    this.rubricsData = this.service.getRubricsData();   
    // this.rubricIsOpen = false;
    if(!this.rubricsIsLoaded) {
      this.rubricIsOpen = true;
      this.rubricsIsLoaded = true;
      this.allRubricsOpen = true;
      // this.showRubricCloseBtn = true;
    }
  }

  toggleRubricsPopup() {
    this.rubricsData = this.service.getRubricsData();   
    // this.rubricIsOpen = false;
    if(!this.rubricsIsLoaded) {
      this.rubricIsOpen = true;
      this.rubricsIsLoaded = true;
      this.allRubricsOpen = true;
      this.showRubricCloseBtn = true;
    } else {
      this.rubricIsOpen = false;
      this.rubricsIsLoaded = false;
      this.allRubricsOpen = false;
      this.showRubricCloseBtn = false;
    }
    this.showRubricCloseBtn = false;
  }

  getAllRubrics() {
    this.isAllrubricsMobile = true;      
    this.allRubrics = this.service.getRubricsData();
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);
    this.rubricIsOpen = false;
    this.rubricsIsLoaded = false;
    this.rubricContentIsOpen = true;
    this.rubricIsActive = true;
  }

  closeRubricsPopup(name, e) {

    setTimeout(() => {
      this.rubricIsOpen = false;
      this.rubricsIsLoaded = false;
      this.rubricContentIsOpen = false;
      this.allRubricsOpen = false;
    }, 200);

    if(this.activeComponent == "map_page") {
      this.headerSearchService.publishMarkersData(name);
    } else {
      this.router.navigate(['../search/', name]);
    }
  }

  closeMobileRubricsPopup() {
    this.nestedRubricIsActive = false;
    this.rubricIsActive = true;
    // this.rubricIsActive = false;
    // this.isAllrubricsMobile = true;
    // this.rubricState = true;
  }

  openedCheckboxSearch(value, search_text) {
    this.open_checkbox = value;
    if(this.near_checkbox && this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&work_now&near");
    } else if(this.near_checkbox && !this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&near");
    } else if(!this.near_checkbox && !this.open_checkbox) {
      this.headerSearchService.publishData(search_text);
    } else if(!this.near_checkbox && this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&work_now");
    }
  }

  besideCheckboxSearch(value, search_text) {
    this.near_checkbox = value;
    if(this.near_checkbox && this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&work_now&near");
    } else if(this.near_checkbox && !this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&near");
    } else if(!this.near_checkbox && this.open_checkbox) {
      this.headerSearchService.publishData(search_text + "&work_now");
    } else if(!this.near_checkbox && !this.open_checkbox) {
      this.headerSearchService.publishData(search_text);
    }
  }

  closeCityPopup() {
    this.showCityPopup = false;
  }

  goBackToRubrics() {
    this.rubricIsOpen = true;
    this.rubricsIsLoaded = true;
    // this.rubricsData = this.service.getRubricsData();
    this.rubricContentIsOpen = false;
    this.showRubricCloseBtn = true;
    console.log(this.showRubricCloseBtn);
  }

  mapPageFilter(name) {
    this.showRubricCloseBtn = false;
    if(this.activeComponent !== "map_page") {
      this.headerSideMapServ.publishData(name);
    }
  }

  chooseRubric(id, title, isRubricHover) {
    if(isRubricHover) {
      this.showRubricCloseBtn = true;
    }
    this.isAllrubricsMobile = false;
    this.rubricData = this.service.getRubricsInfo(id);
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);
    this.rubricIsOpen = false;
    this.rubricsIsLoaded = false;
    this.rubricContentIsOpen = true;
    if(this.rubricContentIsOpen) {
      this.rubricData = this.service.getRubricsInfo(id);
    }
    this.showRubricCloseBtn = true;
  }

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  hideMenu() {
    this.menuState = 'out';
  }

  hideRubrics() {
    this.rubricState = false;
  }

  toggleRubrics() {
    this.rubricState = this.rubricState === false ? true : false;
    this.service.getHeaderData().then((data) => {
      if(data[0].place) {
        this.navigation = data[0].navigation;
      }
    });
  }

  mobileRubricChoose(id) {
    this.isAllrubricsMobile = false;
    this.rubricIsActive = true;
    this.rubricData = this.service.getRubricsInfo(id);
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);
  }

  hidePopupOnRouting() {
    this.nestedRubricIsActive = false;
    this.rubricState = false;
    this.rubricIsActive = false;
  }

  mobileRubricToggle(id) {
    this.rubricState = false;
    this.rubricIsActive = false;
    this.nestedRubricIsActive = true;
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);

    this.rubricsData = this.service.getRubricsInfo(id);
	}

  mobileRubricBack() {
    this.rubricIsActive = false;
  }

  fastSearch(search_body, isOpened, isBeside) {
    this.counter = 1;
    var value = this.inputValue;
    window.clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.counter--;
        if(this.counter === 0) {
          window.clearInterval(this.timer);
          if(this.activeComponent == "map_page") {
            if(search_body) {
              if(isOpened) {
                if(isBeside) {
                  this.headerSearchService.publishMarkersData(search_body + "&work_now&near");
                } else {
                  this.headerSearchService.publishMarkersData(search_body + "&work_now");
                }
              } if(isBeside && !isOpened) {
                this.headerSearchService.publishMarkersData(search_body + "&near");
              } else if(!isBeside && !isOpened) {
                this.headerSearchService.publishData(search_body);
              }
            }
          } else {
            this.headerMapService.mySubject.next(true);
            this.headerSideMapServ.publishData(search_body);
            if(search_body) {
              if(isOpened) {
                if(isBeside) {
                  this.router.navigateByUrl('search/work_now/near/' + search_body);        
                } else {
                  this.router.navigateByUrl('search/work_now/' + search_body);  
                }
              } else if(isBeside) {
                this.router.navigateByUrl('search/near/' + search_body);        
              } else {
                this.router.navigateByUrl('/search/' + search_body);                
              }
            }
          }
        } 
      }, 500);
  }

  openMap() {
    this.serviceHeaderMap.mySubject.next(true);
  }

  toggleRegionsWindow() {
    this.rubricIsOpen = false;
    this.rubricsIsLoaded = false;
    this.rubricContentIsOpen = false;
    this.regionsWindowIsOpen = !this.regionsWindowIsOpen;
  }

  rubricsClick(sector, id) {
    this._http.get("http://apiportal.web14.com.ua/companies?query="
    + sector).toPromise();
    this._http.get("http://apiportal.web14.com.ua/category_click?id="
    + id).toPromise();
    if(!(this.activeComponent == "map_page")) {
      this.router.navigateByUrl('/search/' + sector);
    }
  }

  mobileRubricClick(id) {
    console.log(id);
    this._http.get("http://apiportal.web14.com.ua/category_click?id="
    + id).toPromise();
  }

  toggleNav() {
		this.navToggle = !this.navToggle;
	}

  backToRegionsPopup() {
    this.regionIsSelected = false;
    this.regionsWindowIsOpen = true;
  }

  enterPlace() {
    this.showCityPopup = false;
    this.regionIsSelected = false;
    this.regionsWindowIsOpen = true;
  }

  setCity(place) {
    this.headerMapService.mySubject.next(true);
    this._http.get("http://apiportal.web14.com.ua/setcity?city="
    + place).toPromise();
    this.showCityPopup = false;
  }

  setNewPlace(place) {
    this._http.get("http://apiportal.web14.com.ua/setcity?city="
    + place).toPromise();
    setTimeout(() => {
      this.service.getHeaderData().then((data) => {
        if(data[0].place) {
          this.hasNewPlace = true;
          this.newPlace = data[0].place;
        }
      });
    }, 500);
    
    this.set_place = false;
  }

  chooseRegion(id, title) {
    this.regionsWindowIsOpen = false;
    this.regionIsSelected = true;
    this.selected_region = id;
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);
  } 

  chooseCity(title) {
    this._http.get("http://apiportal.web14.com.ua/setcity?city="
    + title).toPromise();
    setTimeout(() => {
      this.service.getHeaderData().then((data) => {
        if(data[0].place) {
          this.hasNewPlace = true;
          this.newPlace = data[0].place;
        }
      })}, 500);
    this.regionIsSelected = false;
    this.regionsWindowIsOpen = false;
    this.hideMenu();
    this.hideRubrics();
    this.headerMapService.mySubject.next(true);
  }

  seachBegin() {
    if(this.activeComponent == "map_page") {
      this._http.get("http://apiportal.web14.com.ua/companies?query=").toPromise();
      this.headerMapService.mySubject.next(true);
    }
  }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }

  ngAfterViewInit() {
    // this.scrollbarService.initScrollbar('.scrollable', 
    // { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
  }

  ngOnInit() {
    this.headerData = this.service.getHeaderData();
    this.headerData.then((data) => {
      if(data[0].ShowCityPopup) {
        this.showCityPopup = data[0].ShowCityPopup;
      }
    });
  }
}

