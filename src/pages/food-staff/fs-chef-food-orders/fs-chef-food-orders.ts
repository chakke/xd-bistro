import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ORDER_STATE, CHEF_FOOD_STATE, FOOD_ORDER_STATE, FOOD_STATE } from '../../../providers/food-staff/app-constant';
import { FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@IonicPage()
@Component({
  selector: 'page-fs-chef-food-orders',
  templateUrl: 'fs-chef-food-orders.html',
})
export class FsChefFoodOrdersPage {

  searchKeyword = "";
  placholder = "Tìm kiếm";
  selectedOrderStatus = "0";

  chefFoodState = [];
  chefFoodStateData = CHEF_FOOD_STATE;
  chefFoodOrderCollection: Map<number, Array<FoodOrder>> = new Map<number, Array<FoodOrder>>();
  showFoodOrders: Array<FoodOrder> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private alertCtrl: AlertController) {
    for (const key in CHEF_FOOD_STATE) {
      if (CHEF_FOOD_STATE.hasOwnProperty(key)) {
        const state = CHEF_FOOD_STATE[key];
        this.chefFoodState.push(state);
      }
    }
  }

  ionViewDidLoad() {
    this.loadFoodOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
    this.appController.productChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
    this.appController.orderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })
  }

  loadFoodOrder() {
    Object.keys(CHEF_FOOD_STATE).forEach(key => {
      this.chefFoodOrderCollection.set(CHEF_FOOD_STATE[key].id, []);
    });
    this.appController.foodOrders.forEach(foodOrder => {
      //Check food in active order
      let order = this.appController.orderCollection.get(foodOrder.orderId);
      if (order && (order.state == ORDER_STATE.CREATED || order.state == ORDER_STATE.FOOD_DONE)) {
        //Check amount waitting
        if (+foodOrder.food.state != FOOD_STATE.OUT_OF_STOCK.id && (foodOrder.amountOrder - foodOrder.amountDone - foodOrder.amountReturn - foodOrder.amountProcessing > 0)) {
          this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.WAITING.id).push(foodOrder);
        }
        if (+foodOrder.food.state != FOOD_STATE.OUT_OF_STOCK.id && foodOrder.amountProcessing > 0) {
          this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.COOKING.id).push(foodOrder);
        }
        if (+foodOrder.food.state != FOOD_STATE.OUT_OF_STOCK.id && foodOrder.amountDone > 0) {
          this.chefFoodOrderCollection.get(CHEF_FOOD_STATE.DELIVERABLE.id).push(foodOrder);
        }
      }
    });
    this.filterFoodOrders();
  }

  search() {

  }

  filterFoodOrders() {
    this.showFoodOrders = this.chefFoodOrderCollection.get(+this.selectedOrderStatus);
    this.showFoodOrders.sort((a, b) => {
      if (a.timeCreate && b.timeCreate) {
        if (+this.selectedOrderStatus == this.chefFoodStateData.DELIVERABLE.id) {
          return -a.timeCreate.getTime() + b.timeCreate.getTime();
        }
        return a.timeCreate.getTime() - b.timeCreate.getTime();
      }
      return 0;
    })
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

  makeOutOfStock(food: FoodOrder) {
    let alert = this.alertCtrl.create({
      message: "Bạn chắc chắn muốn báo hết sản phẩm?",
      buttons: [{
        text: "Hủy",
        role: "cancel"
      }, {
        text: "OK",
        handler: () => {
          this.appController.showLoading();
          //Update product state
          this.appController.updateProduct(food.food.firebaseId, { state: FOOD_STATE.OUT_OF_STOCK.id }).then(() => {
            this.appController.hideLoading();
          }, error => {
            this.appController.hideLoading();
          });
        }
      }]
    })
    alert.present();
  }

  processing(food: FoodOrder) {
    let alert = this.alertCtrl.create({
      message: "Chọn số lượng muốn chế biến",
      inputs: [{
        type: "number",
        value: food.amountOrder - food.amountDone - food.amountReturn - food.amountProcessing + ""
      }],
      buttons: [{
        text: "Hủy",
        role: "cancel"
      }, {
        text: "OK",
        handler: (data) => {
          if (data && data[0] && data[0] > 0) {
            let number = parseInt(data[0])
            if (number > food.amountOrder - food.amountDone - food.amountReturn - food.amountProcessing) {
              this.appController.showToast("Số lượng chế biến phải nhỏ hơn số lượng gọi");
            } else {
              this.appController.updateFoodOrder(food.firebaseId, {
                state: FOOD_ORDER_STATE.COOKING,
                amount_processing: food.amountProcessing + number
              })
            }
          } else {
            this.appController.showToast("Số lượng phải lớn hơn 0");
          }
        }
      }]
    })
    alert.present();

  }

  done(food: FoodOrder) {
    let alert = this.alertCtrl.create({
      message: "Chọn số lượng báo xong",
      inputs: [{
        type: "tel",
        value: food.amountProcessing + ""
      }],
      buttons: [{
        text: "Hủy",
        role: "cancel"
      }, {
        text: "OK",
        handler: (data) => {
          if (data && data[0] && data[0] > 0) {
            let number = parseInt(data[0])
            if (number > food.amountProcessing) {
              this.appController.showToast("Số lượng phải nhỏ hơn số lượng chế biến");
            } else {
              this.appController.updateFoodOrder(food.firebaseId, {
                amount_processing: food.amountProcessing - number,
                amount_done: food.amountDone + number
              })
            }
          } else {
            this.appController.showToast("Số lượng phải lớn hơn 0");
          }
        }
      }]
    })
    alert.present();
  }

  gotoFoodOrderDetail(food: FoodOrder) {
    this.appController.pushPage("FsChefFoodOrderDetailPage", {
      food: food.food
    });
  }

  gotoOrderDetail(orderId: string) {
    this.appController.pushPage("FsChefOrderDetailPage", {
      orderId: orderId
    })
  }
}
