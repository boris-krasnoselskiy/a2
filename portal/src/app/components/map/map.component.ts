import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as L from 'leaflet';
import { AgmMap, AgmDataLayer } from '@agm/core';
import { MapPageService } from 'app/services/map_page.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as $ from 'jquery';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { HeaderSearchService } from 'app/services/header_search.service';
import { HeaderMapService } from 'app/services/header_map.service';
import { Http } from '@angular/http';
import { LocationStrategy } from '@angular/common';
import { latLng, Layer, icon, tileLayer, marker, Popup } from 'leaflet';
import { PointMapService } from 'app/services/point-map.service';

@Component({
  selector: 'map-page',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(-325px, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('in => out', animate('700ms ease-in-out')),
      transition('out => in', animate('700ms ease-in-out'))
    ]),
    trigger('slide', [
      state('slideIn', style({
        transform: 'translate3d(-325px, 0, 0)'
      })),
      state('slideOut', style({
        transform: 'translate3d(325px, 0, 0)'
      })),
      transition('slideIn => slideOut', animate('700ms ease-in-out')),
      transition('slideOut => slideIn', animate('700ms ease-in-out'))
    ]),
    trigger('mobileSlide', [
        state('slideIn', style({
          transform: 'translate3d(-325px, 0, 0)'
        })),
        state('slideOut', style({
          transform: 'translate3d(0, 0, 0)'
        })),
        transition('slideIn => slideOut', animate('700ms ease-in-out')),
        transition('slideOut => slideIn', animate('700ms ease-in-out'))
      ]),
  ],
})
export class MapPageComponent implements AfterViewInit {
  markers = new Array();
  mainMap: L.Map;
  map: L.Map;
  mapPageData: any;
  isBackFromPoint: boolean;
  clicked: boolean = false;
  isOnlyOnePoints: boolean = false;
  mapIsFullSize: boolean = false;
  coordX; coordY;
  mapWidth: number;
  selectedCompanyId;
  isFilteredPoints: boolean;
  ifPointsIsExsists: boolean = true;
  updatedMapLang;
  updatedMapLatit;
  selectedIndex: number = null;
  pointData: any;
  onePointMapData: any;
  companysData: any;
  getMapData: any;
  widnowWidth: number =  window.innerWidth;
  menuState:string = 'in';
  pointState:string = 'slideIn';
  isOpenSecondColumn: boolean = false;
  hideAllColumns: boolean = true;
  previousUrl: string;
  id: any;
  isWorkNow: boolean = false;
  isNear: boolean = false;
  isNearAndWorkNow: boolean = false;
  error_msg: any;
  onePointLat: any;
  onePointLong: any;
  onePointColor: any;
  onePointTitle;
  onePointTypeImg;
  onePointId;
  mapCenterX;
  mapCenterY;
  pointsFromResult = [];
  //   onePointTitle;
  onePointPopupContent;
  tempdata: any;
  isTrue = false;
  path = this.url.path();

  convertString(value) {
    return parseFloat(value);
  }

  scrollBarInit() {
    this.scrollbarService.initScrollbar('.scrollable', 
    { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
  }

  showPanel() {
    $(".first_column").addClass('animate');
  }

  callCompanyPanel():void {
    setTimeout(() => {
        $(".first_column").addClass('animate');
    }, 500);
    this.scrollBarInit();
  }

  closeAllPanels():void {
    $(".first_column, .second_column").removeClass('animate');
    localStorage.removeItem("pointsId");
    localStorage.removeItem("pointsNumber");
    localStorage.removeItem("req");
  }

  closePinPanel() {
    $(".second_column").removeClass('animate');
    localStorage.removeItem("pointsId");
    localStorage.removeItem("pointsNumber");
  }

  markerCLick(lat, lang) {
    // this.isFilteredPoints = true;
    this.coordX = 49.9808;
    this.coordY = 36.2527;
    this.updatedMapLatit = 49.9808;
    this.updatedMapLang = 36.2527;

    this.getMapData = this.service.getMapPageData();
    this.getMapData.then((data) => {
      this.coordX = this.convertString(data[0].updatedLatitude);
      this.coordY = this.convertString(data[0].updatedLongitude);
    });
  }

  setPointStore(id, index) {
    localStorage.setItem('pointsId', id);
    localStorage.setItem('pointsNumber', index);
  }

  callPointPanel(id, index):void {
    setTimeout(() => {
        $(".second_column").addClass('animate');
        this.scrollBarInit();
    }, 500);

    this.selectedCompanyId = id;
    this.selectedIndex = index;

    this.pointData = this.service.getPointsData(id);
    this.pointData.then((data) => {
      if(data[0]) {
        if(data[0].answer) {
          this.removeMarkers()
          this.isFilteredPoints = false;
        } 
        if(data[0].points[0]) {
          this.isFilteredPoints = true;
          this.updatedMapLang = +data[0].points[0].longitude - 0.015;
          this.updatedMapLatit = +data[0].points[0].latitude + 0.0095;
          this.removeMarkers();

          for(let i = 0; i < data[0].points.length; i++) {
            let curr_point = data[0].points[i];

            this.drawOneMarker(curr_point);
        }
      this.mainMap.panTo(new L.LatLng(this.updatedMapLatit, this.updatedMapLang));
        }
      }
    });
      
    this.scrollBarInit();
    if(window.innerWidth < 990) {
        this.pointState = 'mobileSlide'
    } else {
        this.pointState = 'slideOut';
    }
  }

  setMapCenter(isFilteredPoints, isOnlyOnePoints) {
      if(this.isFilteredPoints || this.isOnlyOnePoints) {
        this.mapCenterX = this.updatedMapLatit;
        this.mapCenterY = this.updatedMapLang;
      } 
      if(!this.isFilteredPoints && !this.isOnlyOnePoints) {
        this.mapCenterX = this.coordX;
        this.mapCenterY = this.coordY;
      }
  }

  getPointId() {
    var path = this.url.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    if(path.includes('point')) {
        this.onePointMapData = this.service.getOnePointData(pointId);
        this.onePointMapData.then((data) => {

          var map_coord_x = +data[0].latitude + 0.017;
          var map_coord_y = +data[0].longitude;
          this.removeMarkers();

            let icon = L.icon({
                iconUrl: this.setIconColor(data[0].type_bg),
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -65]
            });
        
            let marker = L.marker([data[0].latitude, data[0].longitude], {icon: icon})
                    .addTo(this.mainMap)
                    .bindPopup(
                        '<h4 class="blue_line">' + data[0].title + '</h4>' +
                        '<div class="marker_content">' + data[0].map_popup_content + '</div>' +
                        '<div class="place_type" style=background:' + data[0].type_bg + '>' +
                            '<img src=' + data[0].type_image + '>' + 
                        '</div>' + 
                        '<a class="stretched" id=' + data[0].id + '></a>'
                    );
                    
            this.markers.push(marker);

            this.mainMap.panTo(new L.LatLng(map_coord_x, map_coord_y));

        });
    } else if(path.includes('company')) {
      this.pointData = this.service.getPointsData(pointId);
      this.pointData.then((data) => {
        this.removeMarkers();

        this.updatedMapLatit = +data[0].points[0].latitude + 0.015;
        this.updatedMapLang = +data[0].points[0].longitude - 0.02;
  
        for(let i = 0; i < data[0].points.length; i++) {
              let curr_point = data[0].points[i];
  
              this.drawOneMarker(curr_point);
        }
        this.mainMap.panTo(new L.LatLng(this.updatedMapLatit, this.updatedMapLang));

      });
    }
    if(path.lastIndexOf('/')) {
        // return pointId;        
        return false;
    }
  }

  isFromPoint() {
    this.removeMarkers();
    this.getPointId();
    // this.menuState = "out";
    // this.isBackFromPoint = true;
    // this.isTrue = true;
  }

  getCompaniesData(data) {
    this.removeMarkers();
    this.companysData = this.service.getCompanysData(data);
    this.companysData.then((data) => {
      this.error_msg = data[0].answer;
    });
  }

  listenMapActivity(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = event.target.id;
    if(idAttr && idAttr !== "leafletMap") {
        this.router.navigate(['/points/', idAttr]);
    }
  }

  setIconColor(color) {
    if(color == "#4bc76b") {
        return 'assets/imgs/green_pin.svg';
    } else if(color == "#ffb14b") {
        return 'assets/imgs/orange_pin.svg';
    } else if(color == "#9ecc14") {
        return 'assets/imgs/light_green_pin.svg';
    } else if(color == "#39f") {
        return 'assets/imgs/blue_pin.svg';
    } else if(color == "#ff73a2") {
        return 'assets/imgs/blue_pin.svg';
    } else if(color == "#7daeb3") {
        return 'assets/imgs/blue_pin.svg';
    } else {
        return 'assets/imgs/standart_pin.svg';
    }
}

mapLatit() {
    if(!this.isFilteredPoints) {
        return this.coordX;
    } else {
        return this.updatedMapLatit;
    }
}

mapLong() {
    if(!this.isFilteredPoints) {
        return this.coordY;
    } else {
        return this.updatedMapLang;
    }
}

pointsSearch(value, id) {
  this.removeMarkers();

  if(this.isNearAndWorkNow) {
    this.pointData = this.service.filterPointsData(value, id, "&work_now&near");
  } else if(this.isNear) {
    this.pointData = this.service.filterPointsData(value, id, "&near");
  } else if(this.isWorkNow) {
    this.pointData = this.service.filterPointsData(value, id, "&work_now");
  } else {
    this.pointData = this.service.filterPointsData(value, id);
  }
  
  this.pointData.then((data) => {
    if(data[0].points) {
      this.updatedMapLatit = +data[0].points[0].latitude + 0.015;
      this.updatedMapLang = +data[0].points[0].longitude - 0.02;
  
      for(let i = 0; i < data[0].points.length; i++) {
            let curr_point = data[0].points[i];
  
            this.drawOneMarker(curr_point);
      }
      this.mainMap.panTo(new L.LatLng(this.updatedMapLatit, this.updatedMapLang));
    } else {
      this.isFilteredPoints = false;
    }
  });
}


mapInit() {
    this.getMapData = this.service.getMapPageData();
    this.getMapData.then((data) => {
        let coordX = data[0].latitude;
        let coordY = data[0].longitude;
        this.mainMap = L.map('leafletMap').setView([coordX, coordY], 13);
        this.mapPageData = data[0];

        // L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png').addTo(this.mainMap);
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.mainMap);
        
        for(let i = 0; i < this.mapPageData.networks.length; i++) {
            for(let j = 0; j < this.mapPageData.networks[i].points.length; j++) {
                let curr_point = this.mapPageData.networks[i].points[j];

                let icon = L.icon({
                    iconUrl: this.setIconColor(curr_point.pin_color),
                    iconSize: [38, 95],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -65]
                });

            
                let marker = L.marker([curr_point.latitude, curr_point.longitude], {icon: icon})
                        .addTo(this.mainMap)
                        .bindPopup(
                            '<h4 class="blue_line">' + curr_point.title + '</h4>' +
                            '<div class="marker_content">' + curr_point.content + '</div>' +
                            '<div class="place_type" style=background:' + curr_point.pin_color + '>' +
                                '<img src=' + curr_point.type_img + '>' + 
                            '</div>' + 
                            '<a class="stretched" id=' + curr_point.id + '></a>'
                        );
                        
                this.markers.push(marker);

            }

        }
    });
}

removeMarkers() {
    for(var i = 0; i < this.markers.length; i++) {
        this.mainMap.removeLayer(this.markers[i]);
    }
}

drawOneMarker(curr_point) {
  this.markers = [];
  let icon = L.icon({
    iconUrl: this.setIconColor(curr_point.pin_color),
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -65]
  });

  let marker = L.marker([curr_point.latitude, curr_point.longitude], {icon: icon})
          .addTo(this.mainMap)
          .bindPopup(
              '<h4 class="blue_line">' + curr_point.title + '</h4>' +
              '<div class="marker_content">' + curr_point.content + '</div>' +
              '<div class="place_type" style=background:' + curr_point.pin_color + '>' +
                  '<img src=' + curr_point.type_img + '>' + 
              '</div>' + 
              '<a class="stretched" id=' + curr_point.id + '></a>'
          );
          
  this.markers.push(marker);
}

redrawMarkers(search_text, markersInfo = null) {
  this.removeMarkers();
  if(markersInfo) {
    this.getMapData = this.service.getCompanysData(search_text + markersInfo);
    this.getMapData.then((data) => {
      if(data.length > 1) {
        for(let i = 0; i < data.length; i++) {
          this.mapPageData = data[i];
          for(let j = 0; j < this.mapPageData.points.length; j++) {
            let curr_point = this.mapPageData.points[j];
            
            this.drawOneMarker(curr_point);
          }
        }
      } else if(data[0].answer) {
        console.log("ошибка");
      } else {
        for(let i = 0; i < data.length; i++) {
          this.mapPageData = data[i];
          for(let j = 0; j < this.mapPageData.points.length; j++) {
            let curr_point = this.mapPageData.points[j];

            this.drawOneMarker(curr_point);
          }
        }
      }
    });
  } else {
    this.getMapData = this.service.getCompanysData(search_text);
    this.getMapData.then((data) => {
      this.mapPageData = data[0];
      if(this.mapPageData.networks) {
        for (let i = 0; i < this.mapPageData.networks.length; i++) {
          var curr = this.mapPageData.networks[i];
          for(let j = 0; j < curr.points.length; j++) {
            let curr_point = curr.points[j];
  
            let icon = L.icon({
                iconUrl: this.setIconColor(curr_point.pin_color),
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -65]
            });
        
            let marker = L.marker([curr_point.latitude, curr_point.longitude], {icon: icon})
                    .addTo(this.mainMap)
                    .bindPopup(
                        '<h4 class="blue_line">' + curr_point.title + '</h4>' +
                        '<div class="marker_content">' + curr_point.content + '</div>' +
                        '<div class="place_type" style=background:' + curr_point.pin_color + '>' +
                            '<img src=' + curr_point.type_img + '>' + 
                        '</div>' + 
                        '<a class="stretched" id=' + curr_point.id + '></a>'
                    );
                    
            this.markers.push(marker);
          }
        }
      } else {
        for(let i = 0; i < data.length; i++) {
          this.mapPageData = data[i];
          for(let j = 0; j < this.mapPageData.points.length; j++) {
            let curr_point = this.mapPageData.points[j];

            this.drawOneMarker(curr_point);
          }
        }
      }
    });
  }
}

ngOnInit() {
    if(this.getPointId()) {
        this.isFilteredPoints = true;
        this.pointData = this.service.getPointsData(this.getPointId());
        this.pointData.then((data) => {
            this.updatedMapLatit = +data[0].points[0].latitude + 0.0095;
            this.updatedMapLang = +data[0].points[0].longitude - 0.015;
        });
    }
}

  constructor(
        private header_search: HeaderSearchService,
        private point_map_serv: PointMapService,
        private header_map: HeaderMapService,
        private service: MapPageService, 
        private router: Router,
        private _http: Http,
        private url: LocationStrategy,
        private scrollbarService: MalihuScrollbarService
    ) {
      this.mapInit();     

      if(localStorage.getItem('req')) {
        this.getCompaniesData(localStorage.getItem('req'));
        this.callCompanyPanel();
        if(localStorage.getItem('pointsId')) {
            this.callPointPanel(
                localStorage.getItem('pointsId'),
                localStorage.getItem('pointsNumber')
            );
          }
      }

      this.header_map.mySubject.subscribe(() => {
        setTimeout(() => {
          this.mainMap.off();
          this.mainMap.remove();
          this.mapInit();
        }, 500);
      });

      this.point_map_serv.mySubject$.subscribe((data) => {
        setTimeout(() => {
            $(".first_column").addClass('animate');
        }, 1000);


        this.getCompaniesData(data);
    })

      this.header_search.mySubject$.subscribe((data) => {
        this.error_msg = false;
        this.isWorkNow,
        this.isNearAndWorkNow,
        this.isNear = false;

        this.callCompanyPanel();
        this.removeMarkers();
        this.companysData = this.service.getCompanysData(data);
        this.companysData.then((data) => {
          if(data[0].answer) {
            this.error_msg = "Ничего не найдено";
          }
        });

        setTimeout(() => {
          this.scrollBarInit();
        }, 500);

        if(data.includes("work_now&near")) {
          this.isNearAndWorkNow = true;
          this.removeMarkers();
          this.redrawMarkers(data, "?work_now&near");
        } else if(data.includes("work_now")) {
          this.isWorkNow = true;
          this.removeMarkers();
          this.redrawMarkers(data, "?work_now");
        } else if(data.includes("near")) {
          this.isNear = true;
          this.removeMarkers();
          this.redrawMarkers(data, "?near");
        } else {
          this.removeMarkers();
          this.redrawMarkers(data);
        }
      })

      this.header_search.mySubject2$.subscribe((data) => {
        setTimeout(() => {
            $(".first_column").addClass('animate');
        }, 1000);

        this.getCompaniesData(data);
      });

      this.header_search.mySubject1$.subscribe((data) => {
        this.error_msg = false;
        this.pointsFromResult = [];
        if(data == "error") {
          this.error_msg = "Ничего не нашли";
          this.removeMarkers();
        } else {
          this.pointsFromResult = [];
          for(let i = 0; i < data.length; i++) {
            this.pointsFromResult.push(data[i]);
          }
          if(this.pointsFromResult.length) {
            this.removeMarkers();
             for(let i = 0; i < this.pointsFromResult.length; i++) {
                let curr_point =  this.pointsFromResult[i];
                var map_coord_x = +this.pointsFromResult[0].points[0].latitude + 0.017;
                var map_coord_y = +this.pointsFromResult[0].points[0].longitude;
                this.mainMap.panTo(new L.LatLng(map_coord_x, map_coord_y));
                if(curr_point.points.length > 0) {
                  for(let j = 0; j < this.pointsFromResult[i].points.length; j++) {
                    var one_point = this.pointsFromResult[i].points[j];
                    this.drawOneMarker(one_point);
                  }
                }
            }
          }
        }
      });
      
      this.header_map.mySubject.subscribe(() => {
        this.isBackFromPoint = true;
        setTimeout(() => {
            this.getMapData = this.service.getMapPageData();
            this.getMapData.then((data) => {
                this.coordX = this.convertString(data[0].updatedLatitude);
                this.coordY = this.convertString(data[0].updatedLongitude);
              });
        }, 500);
        
      });

      this.router.events
        .filter(e => e instanceof RoutesRecognized)
        .pairwise()
        .subscribe((event: any[]) => {
          var prevUrl = event[0].urlAfterRedirects;
          var isPoint = prevUrl.lastIndexOf('point');
          var isCompany = prevUrl.lastIndexOf('companies');
          if(isPoint > 0 || isCompany > 0) {
            this.isFromPoint();
          }
        });
    }

  extractData(res: Response) {
    var data = res.json();
    return data;
  }

  callToServ(req) {
    this.getCompaniesData(req);
  }

  ngAfterViewInit() {

  }
}
