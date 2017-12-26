import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 
@IonicPage()
@Component({
  selector: 'page-fs-chef-food-order-detail',
  templateUrl: 'fs-chef-food-order-detail.html',
})
export class FsChefFoodOrderDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsChefFoodOrderDetailPage');
  }

}
