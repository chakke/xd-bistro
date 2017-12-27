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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController) {
    this.orderId = this.navParams.get("orderId");
    if (!this.orderId) {
      this.orderId = "PlqBVw6F8Z0rJCNNhy2e";
    }
  }

  ionViewDidLoad() {
    this.loadMenu()
    this.loadProducts();
    this.appController.productChanel.asObservable().subscribe(() => {
      this.loadProducts();
    })
    this.loadOrder();
    this.appController.orderChanel.asObservable().subscribe(() => {
      this.loadOrder();
    })
  }

  loadMenu() {
    this.menuItems = this.appController.productCategories;
    console.log("menu", this.menuItems);
    if (this.menuItems.length > 0)
      this.selectedMenu = this.menuItems[0]
  }

  loadProducts() {
    this.products = this.appController.products.filter(elm => {
      return (elm.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && elm.keyword.includes(this.keyword.toLowerCase()))));
    })
    console.log("load product", this.appController.products, this.selectedMenu.id, this.keyword);
  }

  loadOrder() {
    this.order = this.appController.orderCollection.get(this.orderId);
    this.loadOrderedFood();
    console.log("AddFoodToOrderPage: order change, reload data", this.order);
  }

  loadOrderedFood() {
    this.orderedFood = this.order.foods.filter(food => {
      if (food.food) {
        return food.food.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && food.food.keyword.includes(this.keyword.toLowerCase())));
      }
    })
  }

  search(keyword) {
    this.loadProducts();
    this.loadOrderedFood();
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
        let index = this.order.foods.findIndex(foodOrder => {
          return foodOrder.food.id == product.id;
        })
        if (index > -1) {
          this.order.foods[index].amountOrder += data;
          this.appController.showLoading();
          this.appController.updateFoodOrder(this.order.foods[index]).then(data => {
            console.log("update food order successfully");
            this.appController.hideLoading();
          });
        } else {
          //Add food to order  
          let foodOrder = new FoodOrder();
          foodOrder.foodId = product.id;
          foodOrder.food = product;
          foodOrder.orderId = this.orderId;
          foodOrder.price = product.price;
          foodOrder.amountOrder = data;
          this.appController.showLoading();
          this.appController.addFoodOrder(this.orderId, foodOrder).then(data => {
            console.log("Thêm món thành công", data);
            this.appController.hideLoading();
          }, error => {
            this.appController.hideLoading();
          });
        }
      }
    })
  }

  changeAmount(foodOrder: FoodOrder) {
    foodOrder["highlight"] = true;
    let modal = this.modalCtrl.create("KeypadModalPage", { number: foodOrder.amountOrder });
    modal.present();
    modal.onDidDismiss(data => {
      foodOrder["highlight"] = false;
      if (data) {
        if (data > 0) {
          foodOrder.amountOrder = data;
          this.appController.updateFoodOrder(foodOrder);
        } else {
          this.appController.showToast("Số lượng phải lớn hơn 0");
        }
      }
    })
  }

  back() {
    this.viewCtrl.dismiss();
  }
}
