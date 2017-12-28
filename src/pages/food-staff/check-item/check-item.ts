import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
 
@IonicPage()
@Component({
  selector: 'page-check-item',
  templateUrl: 'check-item.html',
})
export class CheckItemPage {

  order: Order;
  pickIndex: number = 0;
  constructor(
    public appController : AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.order = new Order();
    if(this.navParams.get("order"))this.order = this.navParams.get("order");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckItemPage');
  }

  changeNumber(number){
    if(number!=null && number!=undefined && number > -1 && number <= this.order.foods[this.pickIndex].amountOrder){
      this.order.foods[this.pickIndex].amountReturn = number;
      this.appController.showLoading();
      this.appController.updateFoodOrder(this.order.foods[this.pickIndex]).then(()=>{
        console.log("Update so luong tra thanh cong");
        this.appController.hideLoading();
      }).catch(err=>{
        this.appController.hideLoading();
      })
    }
  }

  pickDate(i){
    this.pickIndex = i;
  }
}
