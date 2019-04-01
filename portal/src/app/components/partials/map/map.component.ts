import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapService } from 'app/services/map.service';
// import { tileLayer, latLng, marker, icon, polygon, circle } from 'leaflet';
import { Router } from '@angular/router';
import { HeaderMapService } from 'app/services/header_map.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as L from 'leaflet';
import { HeaderSideMapService } from 'app/services/header_side_map.service';
import { MapPageService } from 'app/services/map_page.service';
import { HeaderSearchService } from 'app/services/header_search.service';

@Component({
  selector: 'app-map',
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
  ],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})

export class MapComponent implements OnInit, AfterViewInit {
  pointsFromResult: any[];
  isNear: boolean;
  isWorkNow: boolean;
  isNearAndWorkNow: boolean;
  companysData: Promise<any>;
  activeComponent;
  markers = [];
  mapPageData: any;
  isMapInit: boolean = false;
  mainMap: L.Map;
  map: L.Map;
  clicked: boolean = false;
  mapIsFullSize: boolean = false;
  coordX; coordY;
  mapWidth: number;
  getMapData: any;
  widnowWidth: number =  window.innerWidth;
  menuState:string = 'in';
  pointState:string = 'slideIn';
  isOpenSecondColumn: boolean = false;
  hideAllColumns: boolean = true;

  removeMarkers() {
      for(var i = 0; i < this.markers.length; i++) {
          this.mainMap.removeLayer(this.markers[i]);
      }
  }
 
  mapInit(isNeedMap) {
    if(!this.isDisableMap()) {
      setTimeout(() => {
        this.getMapData = this.data.getMapData();
        this.getMapData.then((data) => {
            let coordX = data[0].latitude;
            let coordY = data[0].longitude;
  
            this.mainMap = L.map('sidebarMap').setView([coordX, coordY], 13);
            this.mapPageData = data[0];
  
            L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.mainMap);
            
            for(let i = 0; i < this.mapPageData.markers.length; i++) {
                let curr_point = this.mapPageData.markers[i];
  
                let icon = L.icon({
                    iconUrl: this.setIconColor(curr_point.pin_color),
                    iconSize: [38, 95],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -65]
                });
            
                var marker = L.marker([curr_point.latitude, curr_point.longitude], {icon: icon})
                .addTo(this.mainMap);
  
                this.markers.push(marker);
            }
  
            this.isMapInit = true;
            
            });
            this.isMapInit = true;
            
          }, 500);
        }
  }

  onResize() {
    this.mapWidth = this.widnowWidth - 1170;
  }

  convertString(value) {
    return parseFloat(value)
  }

  collapseMap(map) {
    this.mapIsFullSize = !this.mapIsFullSize;
    this.mapWidth = this.widnowWidth - 1165;
    this.coordX = 49.9886579;
    this.coordY = 36.2346626;
    // map.triggerResize();
  }

  callCompanyPanel():void {
    this.menuState = "out";
  }

  closeAllPanels():void {
    this.menuState = "in";
    this.pointState = 'slideIn';
  }

  callPointPanel():void {
    this.pointState = this.pointState === 'slideOut' ? 'slideIn' : 'slideOut';    
  }

  narrowMap() {
    this.mapWidth = this.widnowWidth - 1165;
  }

  mapClicked(map) {
    if(this.mapWidth !== this.widnowWidth) {
      this.mapIsFullSize = !this.mapIsFullSize;
      this.getMapData.then((data) => {
        this.coordX = data[0].updatedLatitude;
        this.coordY = data[0].updatedLongitude;
      });
      this.mapWidth = this.widnowWidth;
    } else {
      this.getMapData.then((data) => {
        this.coordX = data[0].latitude;
        this.coordY = data[0].longitude;
      });
    }
    setTimeout(() => {
      map.triggerResize();
    }, 200);
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

  isDisableMap() {
    let path = this.url.path();
    var query = path.substr(path.lastIndexOf('/') + 1);
    let regex = /(map_page)/;

    let templateCode = path.match(regex);
    if(templateCode) {
        return true;
    }
  }

  mapEnable() {
    if(this.mapInit) {
        this.mapInit(true);
    }
  }

  getPageUrl() {
    var url = window.location.toString();
    var ar = url.split('/');
    return this.activeComponent = ar[ar.length-1];
  }

  drawOneMarker(curr_point) {    
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
            console.log(this.mapPageData);
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

              // this.markers = [];
              this.markers.push(marker);
            }
          }
        } else {
          this.markers = [];
          for(let i = 0; i < data.length; i++) {
            this.mapPageData = data[i];
            for(let j = 0; j < this.mapPageData.points.length; j++) {
              let curr_point = this.mapPageData.points[j];
              // this.drawOneMarker(curr_point);

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
        }
      });
    }
  }
  
  constructor(
    private service: MapPageService, 
    private data: MapService, 
    private router: Router,
    private headerSearchService: HeaderSearchService, 
    private serviceHeaderMap: HeaderMapService,
    private url: LocationStrategy,
    private headerSideMapServ: HeaderSideMapService,
    private scrollbarService: MalihuScrollbarService
  ) {

    // this.mapInit();

    this.serviceHeaderMap.mySubject.subscribe(() => {
      if(!this.isDisableMap()) {
        this.mainMap.off();
        this.mainMap.remove();
        this.mapInit(true);
      }
    });
    
    this.mapEnable();

    router.events.subscribe(() => {
      this.mapWidth = this.widnowWidth - 1165;
      this.isDisableMap();
      this.isMapInit = false;
      this.mapInit(true);
    });

    this.headerSearchService.mySubject$.subscribe((data) => {
        this.removeMarkers();        
        this.pointsFromResult = [];

        this.companysData = this.service.getCompanysData(data);
        this.companysData.then((data_from_api) => {
            
            for(let i = 0; i < data_from_api.length; i++) {
                for(let j = 0; j < data_from_api[i].points.length; j++) {
                    let one_point = data_from_api[i].points[j];
                    this.pointsFromResult.push(one_point);
                }
            }

            if(this.pointsFromResult.length) {
                for(let i = 0; i < this.pointsFromResult.length; i++) {
                    let first_point_x = this.pointsFromResult[0].latitude;
                    let first_point_y = this.pointsFromResult[0].longitude;
                    let curr_point =  this.pointsFromResult[i];

                    this.mainMap.panTo(new L.LatLng(first_point_x, first_point_y));
                    this.drawOneMarker(curr_point);
                }
            }
        });
    });

    this.headerSideMapServ.mySubject.subscribe((data) => {
        this.isWorkNow,
        this.isNearAndWorkNow,
        this.isNear = false;
        this.removeMarkers();
        this.companysData = this.service.getCompanysData(data);

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
    });

    this.serviceHeaderMap.mySubject.subscribe(() => {
        setTimeout(() => {
            this.companysData = this.data.getMapData();
            this.companysData.then((data) => {
              this.coordX = this.convertString(data[0].latitude);
              this.coordY = this.convertString(data[0].longitude);
            });
        }, 500);
        
    });
    // console.clear();
    
  }

  ngAfterViewInit() {
    // this.mapInit();
  }

  ngOnInit() {
    
    this.mapWidth = this.widnowWidth - 1165;    
    this.getMapData = this.data.getMapData();
    this.getMapData.then((data) => {
      this.coordX = this.convertString(data[0].latitude);
      this.coordY = this.convertString(data[0].longitude);
    });
  }

}

