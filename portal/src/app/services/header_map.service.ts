import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class HeaderMapService  {
  public mySubject = new Subject();
  public mySubject$ = this.mySubject.asObservable();

  publishData(data) {
    this.mySubject.next(data);
  }
}
