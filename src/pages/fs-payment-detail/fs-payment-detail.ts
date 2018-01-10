import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../providers/food-staff/app-controller/app-controller';

/**
 * Generated class for the FsPaymentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fs-payment-detail',
  templateUrl: 'fs-payment-detail.html',
})
export class FsPaymentDetailPage {
  order: Order;
  orderId: string = "";
  
  constructor(
    private appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.orderId = this.navParams.get("orderId");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsPaymentDetailPage');
    this.loadOrder();
    this.appController.orderChanel.asObservable().subscribe(() => {
      this.loadOrder();
    })
  }
  loadOrder() {
    this.order = this.appController.orderCollection.get(this.orderId);
  }
}
