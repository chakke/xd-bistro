import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ORDER_STATE, FOOD_ORDER_STATE } from '../../../providers/food-staff/app-constant';
import { FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@IonicPage()
@Component({
  selector: 'page-fs-chef-orders',
  templateUrl: 'fs-chef-orders.html',
})
export class FsChefOrdersPage {
  searchKeyword = "";
  placholder = "Tìm kiếm";
  viewMode: number = 0;
  selectedOrderStatus = "0";
  ids = [];
  orderStatusData = [
    {
      statusId: 0,
      ids: [FOOD_ORDER_STATE.WAITING, FOOD_ORDER_STATE.COOKING],
      title: "Đang chờ"
    },
    {
      statusId: 1,
      ids: [FOOD_ORDER_STATE.DELIVERABLE, FOOD_ORDER_STATE.DELIVERED],
      title: "Đã hoàn tất"
    }
  ]

  chefFoodOrderCollection: Map<number, Array<FoodOrder>> = new Map<number, Array<FoodOrder>>();
  showFoodOrders: Array<FoodOrder> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsChefOrdersPage');
    this.loadFoodOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
  }

  loadFoodOrder() {
    Object.keys(FOOD_ORDER_STATE).forEach(key => {
      this.chefFoodOrderCollection.set(FOOD_ORDER_STATE[key], []);
    });
    this.appController.chefFoodOrders.forEach(foodOrder => {
      this.chefFoodOrderCollection.get(foodOrder.state).push(foodOrder);
    });
    this.filterFoodOrders();
    console.log("load fucker", this.appController.chefFoodOrders);
  }

  search() {

  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode;
  }

  filterFoodOrders() {
    this.ids = [];
    this.showFoodOrders = [];
    for (const key in this.orderStatusData) {
      if (this.orderStatusData.hasOwnProperty(key)) {
        const element = this.orderStatusData[key];
        if (element.statusId == +this.selectedOrderStatus) this.ids = element.ids;
      }
    }
    this.ids.forEach(id => {
      this.showFoodOrders = this.showFoodOrders.concat(this.chefFoodOrderCollection.get(id));
    });
  }

  getDiffTime(time: Date) {
    if (time) {
      let diff = Math.floor((Date.now() - time.getTime()) / 1000);
      let hours = Math.floor(diff / 3600);
      let minutes = Math.floor((diff - hours * 3600) / 60);
      let seconds = diff - hours * 3600 - minutes * 60;
      return (hours ? hours + "h " : "") + (minutes + "m ");
    } else {
      return '0m';
    }
  }

  getClass(collectionId: number, timeCreate: Date) {
    if (timeCreate) {
      let wattingWarning = {
        cool: {
          minute: 0,
          value: 0
        },
        warm: {
          minute: 10,
          value: 1
        },
        hot: {
          minute: 10,
          value: 2
        }
      }
      let warningCollection = new Map<number, any>();
      warningCollection.set(FOOD_ORDER_STATE.WAITING, wattingWarning);
      let warning = warningCollection.get(collectionId);
      let status = 0;
      let minute = (Date.now() - timeCreate.getTime()) / 1000 / 60;
      for (const key in warning) {
        if (warning.hasOwnProperty(key)) {
          const element = warning[key];
          if (minute >= element.minute && element.value > status) {
            status = element.value;
          }
        }
      }
      console.log("status", status, minute, warning);
      return "warning-" + status;
    }
    return "warning-0";
  }
}
