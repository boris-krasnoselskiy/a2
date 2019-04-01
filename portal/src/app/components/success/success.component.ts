import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  back() {
    var history = window.history;
    history.back();
  }

  constructor() {
    console.clear();
  }

  ngOnInit() {
  }

}
