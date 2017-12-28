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
    this.orderId = this.navParams.get("order");
    
    // console.log("Order: ", this.order);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.loadOrder();
    this.appController.orderChanel.asObservable().subscribe(()=>{
      this.loadOrder();
    })
  }

  addNewFood() {
    let modal = this.modalCtrl.create("AddFoodToOrderPage", { orderId: this.order.id });
    modal.present();

  }

  loadOrder(){
    this.order = this.appController.orderCollection.get(this.orderId);
    this.loadOrderedFood();
    console.log("AddFoodToOrderPage: order change, reload data", this.order);
  }

  loadOrderedFood() {
    this.orderedFood = this.order.foods.filter(product =>{
      return product;
    })
  }
  checkItem() {
    // this.appController.pushPage("CheckItemPage" ,{order: this.order});
    let modal = this.modalCtrl.create("CheckItemPage", { order: this.order });
    modal.present();
  }

  showAlert(food,i){
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
            this.removeDocument(food,i);
          }
        }
      ]
    });
    alert.present();
  }

  removeDocument(food,i){
    this.appController.showLoading();
    this.order.totalPrice -= food.price * food.amountOrder;
    this.order.foods.splice(i,1);
    this.appController.removeFoodOrder(this.orderId,food).then((res: any)=>{
      console.log("Hủy món thành công");
      this.appController.hideLoading();
    });
  }

  showKeyBoard(food: FoodOrder){
    var amount = food.amountOrder;
    let modal = this.modalCtrl.create("KeypadModalPage", { number: (amount ? amount : 1) });
    modal.present();
    modal.onDidDismiss(data =>{
      if(data != null && data != undefined && data > 0){
        let index = this.order.foods.findIndex(foodOrder => {
          return foodOrder.id == food.id;
        })
        if(index > -1){
          this.order.foods[index].amountOrder = data;
          var sum = 0;
          for(let i = 0 ; i< this.order.foods.length ; i++){
            sum += this.order.foods[i].amountOrder * this.order.foods[i].price; 
          }
          this.order.totalPrice = sum;
          this.appController.showLoading();
          this.appController.updateFoodOrder(this.order.foods[index]).then(data => {
            console.log("update food order successfully");
            this.appController.hideLoading();
          });
        }
      }
    })
  }
}
