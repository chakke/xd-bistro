import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ORDER_STATE } from '../../../providers/food-staff/app-constant';

@IonicPage()
@Component({
  selector: 'page-fs-chef-orders',
  templateUrl: 'fs-chef-orders.html',
})
export class FsChefOrdersPage {
  searchKeyword = "";
  placholder = "Tìm kiếm";
  viewMode: number = 1;
  orderStatusData = [
    {
      id: ORDER_STATE.CREATED,
      title: "Đang chờ"
    },
    {
      id: ORDER_STATE.FOOD_DONE,
      title: "Đã hoàn tất"
    }
  ]
  selectedOrderStatus = ORDER_STATE.CREATED + "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsChefOrdersPage');
  }

  search() {

  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode;
  }

  filterOrders(){

  }

}
