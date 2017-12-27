import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider,
    public modalCtrl: ModalController) {
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
    // console.log("menu", this.menuItems);
    if (this.menuItems.length > 0)
      this.selectedMenu = this.menuItems[0]
  }

  loadProducts() {
    this.products = this.appController.products.filter(elm => {
      return (elm.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && elm.keyword.includes(this.keyword.toLowerCase()))));
    })
    // console.log("load product", this.products);
  }

  loadOrder() {    
    this.order = this.appController.orderCollection.get(this.orderId);
    console.log("AddFoodToOrderPage: order change, reload data", this.order);
  }

  search(keyword) {
    this.keyword = keyword;
    this.loadProducts();
  }


  selectMenu(menu) {
    this.selectedMenu = menu;
    this.loadProducts();
  }

  selectProduct(product) {
    let modal = this.modalCtrl.create("KeypadModalPage", { number: 1 });
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null && data != undefined && data > 0) {
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
    })
  }
}
