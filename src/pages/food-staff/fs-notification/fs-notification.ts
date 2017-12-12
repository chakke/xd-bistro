import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 
@IonicPage()
@Component({
  selector: 'page-fs-notification',
  templateUrl: 'fs-notification.html',
})
export class FsNotificationPage {
  mode = "notification";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsNotificationPage');
  }

}
