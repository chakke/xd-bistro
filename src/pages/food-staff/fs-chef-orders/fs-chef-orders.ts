import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ORDER_STATE, CHEF_FOOD_STATE } from '../../../providers/food-staff/app-constant';
import { FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { Order } from '../../../providers/food-staff/classes/order';

@IonicPage()
@Component({
  selector: 'page-fs-chef-orders',
  templateUrl: 'fs-chef-orders.html',
})
export class FsChefOrdersPage {
  searchKeyword = "";
  placholder = "Tìm kiếm";

  chefOrder = [];
  showChefOrder = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsChefOrdersPage');
    this.loadOrder();
    this.appController.foodOrderChanel.asObservable().subscribe(() => {
      this.loadOrder();
    })
  }

  loadOrder() {
    this.chefOrder = [];
    this.appController.orders.forEach(order => {
      if(order.state == ORDER_STATE.CREATED || order.state == ORDER_STATE.FOOD_DONE){
        let doneFood = 0;
        let totalFood = 0;
        order.foods.forEach(foodOrder => {
          totalFood++;
          if (foodOrder.amountOrder == (foodOrder.amountDone + foodOrder.amountReturn)) {
            doneFood++;
          }
        })
        order["doneFood"] = doneFood;
        order["totalFood"] = totalFood;
        this.chefOrder.push(order);
      }
    });
    this.chefOrder.sort((a, b) => {
      if (a.doneFood < a.totalFood && b.doneFood < b.totalFood) {
        return a.timeCreate.getTime() - b.timeCreate.getTime();
      } else {
        return (a.doneFood - a.totalFood) - (b.doneFood - b.totalFood);
      }
    })
    this.filterFoodOrders();
  }

  search() {

  }

  filterFoodOrders() {
    this.showChefOrder = this.chefOrder;
  }
  gotoOrderDetail(order) {
    this.appController.pushPage("FsChefOrderDetailPage", { "orderId": order.id });
  }
}
