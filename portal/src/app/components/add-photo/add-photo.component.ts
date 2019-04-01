import { Component, OnInit, Output, Directive, AfterViewInit } from '@angular/core';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as $ from 'jquery';
import { LocationStrategy } from '@angular/common';
import { RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Message } from 'primeng/components/common/message';
import { FileUploadModule } from 'primeng/primeng';
import { PointService } from 'app/services/point.service';
import { PopupComponent } from 'app/components/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
  entryComponents:[PopupComponent]
})

export class AddPhotoComponent implements AfterViewInit {
  isNotUpladed = true;
  pointData: any;
  activeComponent;
  url;
  path;

  goToback() {
    var history = window.history;
    history.back();
  }
  
  constructor(
    private scrollbarService: MalihuScrollbarService, 
    private http: Http,
    private router: Router,
    private service: PointService,
    private url_adres: LocationStrategy,
    public dialog: MatDialog) {
      console.clear();
      var url = window.location.toString();
      var ar = url.split('/');
      this.activeComponent = ar[ar.length-1];
      // this.url.path()
      this.pointData = this.service.getPointData(this.getPointId());
      this.url = "http://apiportal.web14.com.ua/upload_file?id=" + this.activeComponent;
    }

  msgs: Message[];
  
  uploadedFiles: any[] = [];

  openDialog(): void {
    let dialogRef = this.dialog.open(PopupComponent, {
      // width: '250px',
      data: { message: "Фото успешно отправленны на сервер" }
    });
  }

  getPointId() {
    let path = this.url_adres.path();
    var pointId = path.substr(path.lastIndexOf('/') + 1);
    return pointId;
  }
 
  selectPhotos(): void {
    this.isNotUpladed = false;
  }

  removePhotos(): void {
    this.isNotUpladed = true;
  }

  onUpload(event): void {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      this.router.navigateByUrl('/success');
      // this.openDialog();
    }

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  
  ngAfterViewInit() {
    this.scrollbarService.initScrollbar('.scrollable', 
    { axis: 'y', theme: 'dark-thin', scrollButtons: { enable: false } });
  }
 
}