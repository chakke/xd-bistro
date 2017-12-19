import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { Utils } from '../../../providers/app-utils';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

declare var $: any;

@IonicPage()
@Component({
  selector: 'page-fs-orders',
  templateUrl: 'fs-orders.html',
})


export class FsOrdersPage {
  searchKeyword = "";
  placholder = "Tìm order";
  selectedOrderStatus = "1";
  orderStatusData = [
    {
      id: 1,
      name: "Đang phục vụ"
    },
    {
      id: 2,
      name: "Đã hoàn tất"
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
    this.loadIOrders();

  }

  loadIOrders() {
    this.allOrders = this.appController.getAllOrders();
    this.allOrders.map(elm => {

      //table mapping
      let tables = [];
      let totalPersons = 0;
      // elm.tableIds.forEach(id => {
      //   let table = this.appController.getTableById(id);
      //   if (table) {
      //     totalPersons += table.currentPerson;
      //     tables.push(table);
      //   }
      // });
      elm["tables"] = tables;
      if (tables.length > 0) {
        elm["tableName"] = tables[0].name;
        console.log("tables", tables);
      }
      elm["totalPersons"] = totalPersons;

      //food mapping 
      let totalCost = 0;
      // elm.foods.forEach(food => {
      //   totalCost += food.price * food.quantityInOrder;
      // })
      elm["totalCost"] = totalCost;
    })
    this.filterOrders();
  }

  filterOrders() {
    this.orderCollection.clear();
    this.orderStatusData.forEach(element => {
      this.orderCollection.set(element.id, this.allOrders.filter(order => {
        // return order.status == element.id;
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

  gotoDetail() {
    let modal = this.modalCtrl.create("OrderDetailPage");
    modal.present();
  }

  checkItem() {
    let modal = this.modalCtrl.create("CheckItemPage");
    modal.present();
  }

  pay() {

  }
 
}
