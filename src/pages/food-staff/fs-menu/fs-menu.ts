import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fs-menu',
  templateUrl: 'fs-menu.html',
})
export class FsMenuPage {

  menuItems = [
    { id: 1, title: "Đồ ăn", active: true },
    { id: 2, title: "Đồ uống", active: false },
    { id: 3, title: "Khác", active: false },
    { id: 4, title: "Combo", active: false },
    { id: 5, title: "Service", active: false },
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsMenuPage');
  }
  search() {

  }

  selectMenu(menu) {
    this.menuItems.forEach(element => {
      element.active = false;
    });
    menu.active = true;
  }

}
