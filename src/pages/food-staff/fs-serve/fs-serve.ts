import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CHEF_FOOD_STATE } from '../../../providers/food-staff/app-constant';
import { FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@IonicPage()
@Component({
  selector: 'page-fs-serve',
  templateUrl: 'fs-serve.html',
})
export class FsServePage {
  foodOrders: Array<FoodOrder> = [];
  showFoodOrders: Array<FoodOrder> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider) {
    console.log("fs serve constructor");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsServePage');
    this.loadFoodOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
  }

  loadFoodOrder() {
    this.showFoodOrders = this.appController.foodOrders.filter((foodOrder) => {
      let order = this.appController.orderCollection.get(foodOrder.orderId)
      if (order && order.tables) {
        foodOrder["tables"] = order.tables.join(", ");
      }
      return foodOrder.amountDone > 0;
    });
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
      let cookingWarning = {
        cool: {
          minute: 0,
          value: 0
        },
        warm: {
          minute: 10,
          value: 1
        },
        hot: {
          minute: 15,
          value: 2
        }
      }
      let warningCollection = new Map<number, any>();
      warningCollection.set(CHEF_FOOD_STATE.WAITING.id, wattingWarning);
      warningCollection.set(CHEF_FOOD_STATE.COOKING.id, cookingWarning);
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

  serve(foodOrder: FoodOrder) {
    this.appController.showLoading();
    this.appController.updateFoodOrder(foodOrder.id, {
      amount_done: 0,
      amount_return: foodOrder.amountReturn + foodOrder.amountDone
    }).then(() => {
      this.appController.hideLoading();
    })
  }


}
