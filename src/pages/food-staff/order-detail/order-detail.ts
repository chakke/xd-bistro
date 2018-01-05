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
  orderId: string = "";

  orderedFood: Array<FoodOrder> = [];
  foodRemoves: Array<FoodOrder> = [];
  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    this.orderId = this.navParams.get("orderId");

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
    let modal = this.modalCtrl.create("AddFoodToOrderPage", { order: this.order, foods: this.orderedFood });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.orderedFood = data;
        console.log("order foods",this.order.foods);
      }
    })
 
  }

  loadOrder() {
    this.order = this.appController.orderCollection.get(this.orderId);
    this.loadOrderedFood();
    console.log("AddFoodToOrderPage: order change, reload data", this.order);
  }

  loadOrderedFood() {
    this.orderedFood = this.order.foods.filter(product =>{
      return product.food;
    })
  }
  checkItem() {
    // this.appController.pushPage("CheckItemPage" ,{order: this.order});
    let modal = this.modalCtrl.create("CheckItemPage", { order: this.order });
    modal.present();
  }

  deleteFood(food, i) {
    let alert = this.alertCtrl.create({
      title: "Hủy món",
      message: "Bạn có chắc chắn muốn hủy món ăn này không ?",
      buttons: [
        {
          text: "Không",
          handler: () => {
            console.log("Click không");

          }
        },
        {
          text: "Có",
          handler: () => {
            console.log("Click Có");
            this.removeDocument(food, i);
          }
        }
      ]
    });
    alert.present();
  }

  removeDocument(food: FoodOrder, i) {
    if (food.amountReturn > 0 || food.amountDone > 0 || food.amountProcessing > 0) {
      this.appController.showToast("Món đã được chế biến không được hủy, Bạn có thể thay đổi số lượng", 3000);
      return;
    }
    this.orderedFood.splice(i, 1);
    this.foodRemoves.push(food);
  }

  updateFood(food: FoodOrder, i) {
    var amount = food.amountOrder;
    let modal = this.modalCtrl.create("KeypadModalPage", { number: (amount ? amount : 1) });
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null && data != undefined && data > 0) {
        console.log("number back", data);
        var sum = food.amountDone + food.amountProcessing + food.amountReturn;
        if (data != food.amountOrder && data > sum) {
          this.orderedFood[i].amountOrder =  data;
          console.log("order foods",this.order.foods);
          
        } else {
          this.appController.showToast(
            "Return: " + food.amountReturn +
            "Doing: " + food.amountProcessing +
            "Done:" + food.amountDone +
            "Số lượng mới phải lớn hơn" + sum,
            3000
          );
        }
      }
    })
  }

  caculateTotalPrice(): number{
    var sum: number = 0;
    if(this.orderedFood && this.orderedFood.length > 0){
      this.orderedFood.forEach(element => {
        sum+= element.amountOrder * element.price;
      });
    }
    return sum;
  }

  updateItem() {
    console.log("orderedfood", this.orderedFood);
    console.log("orders",this.order.foods);
    
    this.appController.showLoading();
    if (this.orderedFood.length > 0) {
      for (let index = 0; index < this.orderedFood.length; index++) {
        let food = this.orderedFood[index];
        if (!food.firebaseId && !food.id && !food.staffId) {
          this.appController.addFoodOrder(this.order.id, food).then(() => {
            console.log("Add new foodorder to firebase sucess");
          }).catch((err) => {
            console.log("Error add new foodorder", err);
          })
        }else{
          this.appController.updateFoodOrder(food.firebaseId,{
            amount_order: food.amountOrder
          }).then(()=>{
            console.log("Update sucess");
            
          }).catch((err)=>{
            console.log("Update error",err);
            
          })
        }
      }
    }
    if(this.foodRemoves && this.foodRemoves.length > 0){
      for (let index = 0; index < this.foodRemoves.length; index++) {
        let element = this.foodRemoves[index];
        if(element.firebaseId){
          this.appController.removeFoodOrder(element.firebaseId).then(()=>{
            console.log("Remove sucess!");
            
          }).catch((err)=>{
            console.log("error when remove foodorder",err);
            
          })
        }
      }
    }
    this.foodRemoves = [];
    // this.order.totalPrice = this.caculateTotalPrice();
    this.appController.hideLoading();
    this.order.totalPrice = this.caculateTotalPrice();
  }
}
