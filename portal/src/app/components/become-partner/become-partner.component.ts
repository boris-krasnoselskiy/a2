import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { BecomeService } from 'app/services/become.service';

@Component({
  selector: 'app-become-partner',
  templateUrl: './become-partner.component.html',
  styleUrls: ['./become-partner.component.scss']
})
export class BecomePartnerComponent implements OnInit {
  private path = this.url.path();
  private newsData;
  private formValues = {
    'name': '',
    'phone': '',
    'email': '',
    'target': ''
  };

  goToback() {
    var history = window.history;
    history.back();
  }

  getComponentUrl() {
    let path = this.url.path();
    var componentUrl = path.substr(path.indexOf('/'), path.lastIndexOf('/'));
    return componentUrl;
  }

  sendFeedback(name, phone, email, company_name) {
    this.formValues.target = this.getComponentUrl();
    this.formValues.name = name;
    this.formValues.phone = phone;
    this.formValues.email = email;
    this.service.postTextData(this.formValues);
  }

  constructor(
    private router: Router,
    public service: BecomeService,
    private url: LocationStrategy
  ) {
    console.clear();
  }

  ngOnInit() {
  }

}
