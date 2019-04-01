import { Component, OnInit } from '@angular/core';
import { AddCompanyService } from 'app/services/add-company.service';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  private path = this.url.path();
  private newsData;
  private formValues = {
    'name': '',
    'phone': '',
    'email': '',
    'companyName': '',
    'target': ''
  };

  addCompany(name, phone, email, company_name) {
    this.formValues.target = this.getComponentUrl();
    this.formValues.name = name;
    this.formValues.phone = phone;
    this.formValues.email = email;
    this.formValues.companyName = company_name;
    this.service.postCompanyData(this.formValues);
  }

  getComponentUrl() {
    let path = this.url.path();
    var componentUrl = path.substr(path.lastIndexOf('/') + 1);
    return componentUrl;
  }

  goToback() {
    var history = window.history;
    history.back();
  }

  constructor(
    private router: Router,
    public service: AddCompanyService,
    private url: LocationStrategy
  ) {
    console.clear();
  }

  ngOnInit() {
  }
}
