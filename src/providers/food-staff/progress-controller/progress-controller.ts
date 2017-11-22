import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProgressControllerProvider {
  private loaderSubject = new Subject<string>();
  loaderState = this.loaderSubject.asObservable();

  constructor() {
     
  }

  show() {
    this.loaderSubject.next("show");
  }
  hide() {
    this.loaderSubject.next("hide");
  }
  speedUp() {
    this.loaderSubject.next("speedUp");
  }
}

