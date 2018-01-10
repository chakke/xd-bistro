import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { ORDER_STATE } from '../../../providers/food-staff/app-constant';
 
@IonicPage()
@Component({
  selector: 'page-check-item',
  templateUrl: 'check-item.html',
})
export class CheckItemPage {

  order: Order;
  pickIndex: number = 0;
  constructor(
    private alertController : AlertController,
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
      this.appController.updateFoodOrder(this.order.foods[this.pickIndex].firebaseId,this.order.foods[this.pickIndex]).then(()=>{
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

  requestPay(){
    let alert = this.alertController.create({
      message: "Bạn muốn thanh toán hóa đơn ?",
      title:"Thanh toán",
      buttons:[
        {
          text:"Hủy",
          handler:()=>{
            console.log("Click hủy");
            
          }
        },
        {
          text:"Thanh toán",
          handler:()=>{
            console.log("Click thanh toán");
            this.appController.showLoading();
            this.appController.updateOrder(this.order.firebaseId,{
              state: ORDER_STATE.WAITING
            }).then(()=>{
              this.appController.hideLoading();
              this.appController.showToast("Đã gửi yêu cầu thanh toán đến thu ngân",3000);
            }).catch((err)=>{
              this.appController.showToast("Lỗi"+err,3000);
              this.appController.hideLoading();
            })
          }
        }
      ]
    });
    alert.present();
  }

}
