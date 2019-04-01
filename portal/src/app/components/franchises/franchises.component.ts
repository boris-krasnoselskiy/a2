import { Component, OnInit } from '@angular/core';
import { Http, Response } from "@angular/http";
import { FranchisesService } from 'app/services/franchises.service';

@Component({
  selector: 'app-franchises',
  templateUrl: './franchises.component.html',
  styleUrls: ['./franchises.component.scss']
})
export class FranchisesComponent implements OnInit {
  franchisesData: Promise<any[]>;

  goToback() {
    var history = window.history;
    history.back();
  }

  constructor(private _http: Http, private service: FranchisesService) { 
    console.clear();
  }

  ngOnInit() {
    this.franchisesData = this.service.getFranchisesData();
  }

}
