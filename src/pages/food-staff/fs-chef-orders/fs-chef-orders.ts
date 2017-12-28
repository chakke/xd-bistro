import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ORDER_STATE, CHEF_FOOD_STATE } from '../../../providers/food-staff/app-constant';
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
  selectedOrderStatus = "0";

  chefFoodState = [];
  chefFoodOrderCollection: Map<number, Array<FoodOrder>> = new Map<number, Array<FoodOrder>>();
  showFoodOrders: Array<FoodOrder> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider) {
    for (const key in CHEF_FOOD_STATE) {
      if (CHEF_FOOD_STATE.hasOwnProperty(key)) {
        const state = CHEF_FOOD_STATE[key];
        this.chefFoodState.push(state);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsChefOrdersPage');
    this.loadFoodOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
  }

  loadFoodOrder() {
    Object.keys(CHEF_FOOD_STATE).forEach(key => {
      this.chefFoodOrderCollection.set(CHEF_FOOD_STATE[key].id, []);
    });
    this.appController.foodOrders.forEach(foodOrder => {
      //Check amount waitting
      if (foodOrder.amountOrder - foodOrder.amountDone - foodOrder.amountReturn - foodOrder.amountProcessing > 0) {
        this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.WAITING.id).push(foodOrder);
      }
      if (foodOrder.amountProcessing > 0) {
        this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.COOKING.id).push(foodOrder);
      }
      if (foodOrder.amountDone > 0) {
        this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.DELIVERABLE.id).push(foodOrder);
      }
    });
    this.filterFoodOrders();
  }

  search() {

  }
 
  filterFoodOrders() {
    this.showFoodOrders = this.chefFoodOrderCollection.get(+this.selectedOrderStatus);
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
          minute: 5,
          value: 1
        },
        hot: {
          minute: 10,
          value: 2
        }
      }
      let warningCollection = new Map<number, any>();
      warningCollection.set(CHEF_FOOD_STATE.WAITING.id, wattingWarning);
      let warning = warningCollection.get(+collectionId);
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
      return "warning-" + status;
    }
    return "warning-0";
  }
}
