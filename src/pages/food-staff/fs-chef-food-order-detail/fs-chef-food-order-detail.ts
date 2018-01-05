import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Product, FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { FOOD_STATE, FOOD_ORDER_STATE } from '../../../providers/food-staff/app-constant';

@IonicPage()
@Component({
  selector: 'page-fs-chef-food-order-detail',
  templateUrl: 'fs-chef-food-order-detail.html',
})
export class FsChefFoodOrderDetailPage {
  title = "Chi tiết món";
  food: Product;
  processingFoodOrders: Array<FoodOrder> = [];
  wattingFoodOrders: Array<FoodOrder> = [];
  totalAmount: number = 0;
  foodStateData = FOOD_STATE;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider,
    public alertCtrl: AlertController) {
    this.food = this.navParams.get("food");
  }

  ionViewDidLoad() {
    this.loadFoodOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadFoodOrder();
    })

  }

  loadFoodOrder() {
    this.totalAmount = 0;
    this.processingFoodOrders = this.appController.foodOrders.filter(food => {
      return (food.foodId == this.food.id) && ((food.amountProcessing) > 0);
    })
    this.wattingFoodOrders = this.appController.foodOrders.filter(food => {
      return (food.foodId == this.food.id) && ((food.amountOrder - food.amountDone - food.amountReturn - food.amountProcessing) > 0);
    })
    this.processingFoodOrders.forEach(food => {
      this.totalAmount += food.amountProcessing;
    })
    this.wattingFoodOrders.forEach(food => {
      this.totalAmount += food.amountOrder - food.amountDone - food.amountReturn - food.amountProcessing;
    })
    console.log("processing",this.processingFoodOrders);
    
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
  makeInStock(food: FoodOrder) {
    this.appController.showLoading();
    //Update product state
    this.appController.updateProduct(food.food.firebaseId, { state: FOOD_STATE.AVAILABLE.id }).then(() => {
      this.appController.hideLoading();
    }, error => {
      this.appController.hideLoading();
    });
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

}
