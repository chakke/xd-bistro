import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  viewMode = "0";
  order: Order;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    this.order = this.navParams.get("order");
    console.log("OrderDetailPage: ", this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  addNewFood() {
    let modal = this.modalCtrl.create("AddFoodToOrderPage", { orderId: this.order.id });
    modal.present();

  }

  checkItem() {
    this.appController.pushPage("CheckItemPage");
  }

}
