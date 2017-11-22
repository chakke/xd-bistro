import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

 
@IonicPage()
@Component({
  selector: 'page-fs-setting',
  templateUrl: 'fs-setting.html',
})
export class FsSettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsSettingPage');
  }

}
