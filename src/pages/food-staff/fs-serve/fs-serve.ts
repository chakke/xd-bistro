import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fs-serve',
  templateUrl: 'fs-serve.html',
})
export class FsServePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("fs serve constructor");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsServePage');
  }

}
