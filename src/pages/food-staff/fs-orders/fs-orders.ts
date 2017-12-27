import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { Utils } from '../../../providers/app-utils';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ORDER_STATE } from '../../../providers/food-staff/app-constant';

declare var $: any;

@IonicPage()
@Component({
  selector: 'page-fs-orders',
  templateUrl: 'fs-orders.html',
})


export class FsOrdersPage {
  searchKeyword = "";
  placholder = "Tìm order";
  selectedOrderStatus = "0";
  orderStatusData = [
    {
      id: ORDER_STATE.CREATED,
      name: "Đang đợi món"
    },
    {
      id: ORDER_STATE.FOOD_DONE,
      name: "Đã đủ món"
    },
    {
      id: ORDER_STATE.PAID,
      name: "Đã thanh toán"
    },
    {
      id: ORDER_STATE.CANCELLED,
      name: "Đã hủy"
    }
  ]

  orderCollection: Map<any, Array<Order>> = new Map<any, Array<Order>>();
  allOrders: Array<Order> = [];
  showOrders: Array<Order> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsOrdersPage');
    this.loadOrders();
    this.appController.orderChanel.asObservable().subscribe(data => {
      console.log("Order in app controller change", data);
      this.loadOrders();
    })
  }

  loadOrders() {
    this.allOrders = this.appController.getAllOrders();
    this.filterOrders();
  }

  filterOrders() {
    this.orderCollection.clear();
    this.orderStatusData.forEach(element => {
      this.orderCollection.set(element.id, this.allOrders.filter(order => {
        return order.state == element.id;
      }));
    });

    this.showOrders = this.orderCollection.get(+this.selectedOrderStatus);
    console.log(this.showOrders);
  }

  addNewOrders() {
    let modal = this.modalCtrl.create("CreateOrderPage");
    modal.present();
  }

  formatPrice(price: number) {
    return Utils.formatNumber(price, ".");
  }

  gotoDetail(order) {
    let modal = this.modalCtrl.create("OrderDetailPage", { order: order });
    modal.present();
  }

  checkItem(order) {
    let modal = this.modalCtrl.create("CheckItemPage", { order: order });
    modal.present();
  }

  pay() {

  }

}
