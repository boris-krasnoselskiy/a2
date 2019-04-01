import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { RubricsService } from 'app/services/rubrics.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

export class ExpansionDemo {
  displayMode: any = 'default';
  multi = false;
  hideToggle = false;
  disabled = false;
  showPanel3 = true;
  expandedHeight: string;
  collapsedHeight: string;
}

@Component({
  selector: 'app-rubrics',
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class RubricsComponent implements OnInit, AfterViewInit {
  private rubrics;
  selectedRubricks: any;

  constructor(
    private scrollbarService: MalihuScrollbarService, 
    router: Router,
    private url: LocationStrategy,
    public service: RubricsService
  ) {
    console.clear();
    this.selectedRubricks = this.getId();
    this.rubrics = this.service.getRubricsData();

    router.events.subscribe(() => {
      this.selectedRubricks = this.getId();
    });

    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 1000);
  }

  goToback() {
    const history = window.history;
    history.back();
  }

  expandPanelFunc() {
    this.scrollbarService.initScrollbar('.scrollable', 
    { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
  }

  getId() {
    const path = this.url.path();
    const pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollbarService.initScrollbar('.scrollable', 
      { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
    }, 500);
  }

}
