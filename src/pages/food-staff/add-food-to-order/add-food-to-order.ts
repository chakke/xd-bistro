import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Product, FoodOrder } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Order } from '../../../providers/food-staff/classes/order';

@IonicPage()
@Component({
  selector: 'page-add-food-to-order',
  templateUrl: 'add-food-to-order.html',
})
export class AddFoodToOrderPage {
  menuItems = [];
  selectedMenu = { id: "3", title: "Đồ ăn" };
  keyword = "";
  products: Array<Product> = [];
  orderId: string = "";
  order: Order;
  orderedFood: Array<FoodOrder> = [];
  foods: Array<FoodOrder> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController) {
    if(navParams.get("order"))this.order = this.navParams.get("order");
    if(navParams.get("foods")){
      let data = this.navParams.get("foods");
      data.forEach(element => {
        this.foods.push(new FoodOrder(element));
      });
    }
  }

  ionViewDidLoad() {
    this.loadMenu()
    this.loadOrder();
    this.loadProducts();
  }

  loadMenu() {
    this.menuItems = this.appController.productCategories;
    if (this.menuItems.length > 0)
      this.selectedMenu = this.menuItems[0]
  }

  loadProducts() {
    this.products = this.appController.products.filter(elm => {
      return (elm.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && elm.keyword.includes(this.keyword.toLowerCase()))));
    });

    this.products.forEach(product => {

      let index = this.orderedFood.findIndex(foodOrder => {
        return foodOrder.foodId == product.id;
      })

      if (index >= 0) {
          product["ordered"] = true;
          product["amountOrder"] = this.orderedFood[index].amountOrder;
      } else {
        product["ordered"] = false;
      }

    });

    console.log("load product", this.appController.products, this.selectedMenu.id, this.keyword);
  }

  loadOrder() {
    this.loadOrderedFood();
  }

  loadOrderedFood() {
    this.orderedFood = this.foods.filter(food => {
      if (food.food) {
        return food.food.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && food.food.keyword.includes(this.keyword.toLowerCase())));
      }
    })
  }

  search(keyword) {
    this.loadOrderedFood();
    this.loadProducts();
  }


  selectMenu(menu) {
    this.selectedMenu = menu;
    this.loadOrderedFood();
    this.loadProducts();
  }

  selectProduct(product) {
    product.highlight = true;
    let modal = this.modalCtrl.create("KeypadModalPage", { number: 1 });
    modal.present();
    modal.onDidDismiss(data => {
      product.highlight = false;
      if (data != null && data != undefined && data > 0) {

        product["ordered"] = true;

        let foodOrder = new FoodOrder();
        foodOrder.foodId = product.id;
        foodOrder.food = product;
        foodOrder.orderId = this.order.id;
        foodOrder.price = product.price;
        foodOrder.amountOrder = data;

        this.orderedFood.push(foodOrder);
        this.foods.push(foodOrder);

      }
    })
  }

  changeAmount(foodOrder: FoodOrder, i) {
    foodOrder["highlight"] = true;
    let modal = this.modalCtrl.create("KeypadModalPage", { number: foodOrder.amountOrder });
    modal.present();
    modal.onDidDismiss(data => {
      foodOrder["highlight"] = false;
      if (data) {
        if (data > 0) {
          foodOrder.amountOrder = data;
          this.orderedFood[i].amountOrder = data;
          let index = this.foods.findIndex(ele=>{
            return ele.foodId == foodOrder.foodId;
          })
          if(index >= 0){
            this.foods[index].amountOrder = data;
          }
        } else {
          this.appController.showToast("Số lượng phải lớn hơn 0");
        }
      }
    })
  }

  back() {
    this.viewCtrl.dismiss(this.foods);
  }

  back1() {
    this.viewCtrl.dismiss();
  }
}
