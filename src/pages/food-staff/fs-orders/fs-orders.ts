import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { Utils } from '../../../providers/app-utils';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ORDER_STATE, TABLE_STATE } from '../../../providers/food-staff/app-constant';

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
      id:0,
      state: [ORDER_STATE.CREATED, ORDER_STATE.FOOD_DONE],
      name: "Đang phục vụ" //Nhóm này gồm những order có state = CREATED || FOOD_DONE
    },
    {
      id: 1,
      state: [ORDER_STATE.PAID, ORDER_STATE.WAITING],
      name: "Đã thanh toán"
    },
    {
      id: 2,
      state: [ORDER_STATE.CANCELLED],
      name: "Đã hủy"
    }
  ]

  orderCollection: Map<any, Array<Order>> = new Map<any, Array<Order>>();
  allOrders: Array<Order> = [];
  showOrders: Array<Order> = [];

  constructor(
    private mAlertController: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsOrdersPage');
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
        return element.state.indexOf(order.state) > -1;
      }));
    });

    this.showOrders = this.orderCollection.get(+this.selectedOrderStatus);
    console.log("showOrders", this.showOrders);
  }

  addNewOrders() {
    let modal = this.modalCtrl.create("CreateOrderPage");
    modal.present();
  }

  formatPrice(price: number) {
    return Utils.formatNumber(price, ".");
  }

  gotoDetail(order) {
    let modal = this.modalCtrl.create("OrderDetailPage", { orderId: order.id });
    modal.present();
    modal.onDidDismiss(data => {

    })
  }

  checkItem(order) {
    let modal = this.modalCtrl.create("CheckItemPage", { order: order });
    modal.present();
  }

  cancelOrder(order: Order) {
    let alert = this.mAlertController.create({
      message: "Bạn có chắc muốn hủy order ?",
      title: "Hủy Order",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            console.log("Click Cancel!");

          }
        },
        {
          text: "Ok",
          handler: () => {
            console.log("Click Ok");
            this.removeOrder(order);
          }
        }
      ]
    })
    alert.present();
  }

  removeOrder(order) {
    this.appController.showLoading();
    // if (order.foods && order.foods.length > 0) {
    //   for (let i = 0; i < order.foods.length; i++) {
    //     this.appController.removeFoodOrder(order.foods[i].firebaseId).then(() => {
    //       console.log("remove foodorder sucess!");

    //     }).catch((err) => {
    //       console.log("remove foodorder fail!", err);
    //       this.appController.hideLoading();

    //     })
    //   }
    // }
    if (order.tableIds && order.tableIds.length > 0) {
      for (let j = 0; j < order.tableIds.length; j++) {
        this.appController.updateTable(order.tableIds[j], {
          state: TABLE_STATE.NO_ORDER
        }).then(() => {
          console.log("Update table to free sucess!");

        }).catch((err) => {
          console.log("Update table to free fail!", err);
          this.appController.hideLoading();

        })
      }
    }
    this.appController.updateOrder(order.firebaseId, {
      state: ORDER_STATE.CANCELLED
    }).then(() => {
      console.log("Remove order sucess!");

    }).catch((err) => {
      console.log("Remove order fail!", err);
      this.appController.hideLoading();

    })
    this.appController.hideLoading();
  }

  respone(order: Order) {
    let alert = this.mAlertController.create({
      message: "Bạn có chắc muốn khôi phục hóa đơn này ?",
      title: "Khôi phục hóa đơn",
      buttons: [
        {
          text: "Hủy",
          handler: () => {
            console.log("Click cancel");

          }
        },
        {
          text: "Khôi phục",
          handler: () => {
            console.log("Click khôi phục");
            this.restore(order);
          }
        }
      ]
    })
    alert.present();
  }

  restore(order: Order) {
    if (order.tables && order.tables.length > 0) {
      for (let i = 0; i < order.tables.length; i++) {
        if (order.tables[i].status != "0") {
          this.appController.showToast("Bàn đang được phục vụ không thể khôi phục order!", 3000);
          return;
        }
      }
    }
    for (let j = 0; j < order.tableIds.length; j++) {
      this.appController.updateTable(order.tableIds[j], {
        state: TABLE_STATE.HAS_ORDER
      }).then(() => {
        console.log("Khôi phục bàn thành công !");

      }).catch((err) => {
        console.log("Khôi phục thất bại");

      })
    }
    this.appController.updateOrder(order.firebaseId, {
      state: ORDER_STATE.CREATED
    }).then(() => {
      console.log("Khôi phục thành công");

    }).catch((err) => {
      console.log("Khôi phục thất bại", err);

    })
  }

}
