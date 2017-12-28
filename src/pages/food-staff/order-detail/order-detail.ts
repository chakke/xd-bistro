import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Order } from '../../../providers/food-staff/classes/order';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { FoodOrder } from '../../../providers/food-staff/classes/product';


@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  viewMode = "0";
  order: Order;
  orderId : string = "";

  orderedFood: Array<FoodOrder> = [];

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    this.order = this.navParams.get("order");
    this.orderId = this.order.id;
    this.loadOrderedFood();
    
    console.log("Order: ", this.order);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  addNewFood() {
    let modal = this.modalCtrl.create("AddFoodToOrderPage", { orderId: this.order.id });
    modal.present();

  }

 

  loadOrderedFood() {
    this.orderedFood = this.order.foods.filter(product =>{
      return product.food;
    })
  }
  checkItem() {
    this.appController.pushPage("CheckItemPage");
  }

  showAlert(food){
    let alert = this.alertCtrl.create({
      title:"Hủy món",
      message: "Bạn có chắc chắn muốn hủy món ăn này không ?",
      buttons: [
        {
          text: "Không",
          handler: () =>{
            console.log("Click không");
            
          }
        },
        { 
          text: "Có",
          handler : () =>{
            console.log("Click Có");
            this.removeDocument(food);
          }
        }
      ]
    });
    alert.present();
  }

  removeDocument(food){
    this.appController.showLoading();
    this.appController.removeFoodOrder(this.orderId,food).then((res: any)=>{
      console.log("Hủy món thành công");
      this.appController.hideLoading();
    });
  }
}
