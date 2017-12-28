import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { FOOD_STATE } from '../../../providers/food-staff/app-constant';

@IonicPage()
@Component({
  selector: 'page-fs-chef-menu',
  templateUrl: 'fs-chef-menu.html',
})
export class FsChefMenuPage {

  menuItems = [];
  selectedMenu = { id: "3", title: "Đồ ăn" };
  keyword = "";
  products: Array<Product> = [];
  productState = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appController: AppControllerProvider) {
    this.productState = FOOD_STATE;
  }

  ionViewDidLoad() {
    this.loadMenu()
    this.loadProducts();
    this.appController.productChanel.asObservable().subscribe(() => {
      this.loadProducts();
    })
  }

  loadMenu() {
    this.menuItems = this.appController.productCategories;
    if (this.menuItems.length > 0)
      this.selectedMenu = this.menuItems[0]
  }

  loadProducts() {
    this.products = this.appController.products.filter(elm => {
      return (elm.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && elm.keyword.includes(this.keyword.toLowerCase()))));
    })
    console.log("load product", this.products);
  }

  search(keyword) {
    this.keyword = keyword;
    this.loadProducts();
  }


  selectMenu(menu) {
    this.selectedMenu = menu;
    this.loadProducts();
  }

  changeState(product: Product, state: number) {
    this.appController.showLoading();
    this.appController.updateProduct(product.firebaseId, { state: state }).then(() => {
      this.appController.hideLoading();
    });
  }

}
