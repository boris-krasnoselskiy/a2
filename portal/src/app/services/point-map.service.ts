import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class PointMapService {
  public mySubject = new Subject<string>();
  mySubject$ = this.mySubject.asObservable();

  publishData(data: string) {
    this.mySubject.next(data);
  }
}
