import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { ORDER_STATE } from '../../../providers/food-staff/app-constant';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

/**
 * Generated class for the FsPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fs-payment',
  templateUrl: 'fs-payment.html',
})
export class FsPaymentPage {
  orderCollection: Map<any, Array<Order>> = new Map<any, Array<Order>>();
  allOrders: Array<Order> = [];
  showOrders: Array<Order> = [];
  searchKeyword = "";
  placholder = "Tìm order";
  selectedOrderStatus = "0"; 
  priceSale: number = 132800;
  pricePercent: number = 10;
  orderStatusData = [
    {
      id: ORDER_STATE.CREATED,
      name: "Đang phục vụ"
    },
    {
      id: ORDER_STATE.FOOD_DONE,
      name: "Đã hoàn tất"
    }
  ] ;

  constructor(
    private appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsPaymentPage');
    this.loadOrders();
    this.appController.orderChanel.asObservable().subscribe(data => {
      console.log("Page Order - Order in app controller change", data);
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
        return order.state == element.id && (this.searchKeyword == "" || (this.searchKeyword && order.tableIds.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())));
      }));
    });

    this.showOrders = this.orderCollection.get(+this.selectedOrderStatus);
    
    console.log("showOrders", this.showOrders);
  }
  testfilterOrders(){
    this.showOrders = this.orderCollection.get(0);
  }

  search(){
    console.log("search",this.searchKeyword);
    
    this.filterOrders();
    this.showOrders.forEach(element => {
      console.log(element.tableIds.toString());
      
    });
  }

  pay(order){
    this.appController.pushPage("FsPaymentDetailPage",{"orderId": order.firebaseId});
  }
}
