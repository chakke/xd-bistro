import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../../providers/food-staff/classes/product';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { FOOD_STATE } from '../../../providers/food-staff/app-constant';
import { MenuItem } from '../../../components/food-staff/menu-bar/menu-bar';

@IonicPage()
@Component({
  selector: 'page-fs-menu',
  templateUrl: 'fs-menu.html',
})
export class FsMenuPage {
  menus : Array<MenuItem> = [];
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
    this.loadMenu();
    
  }

  ionViewDidLoad() {
  
    this.loadProducts();
    this.appController.productChanel.asObservable().subscribe(() => {
      this.loadProducts();
    })
  }

  loadMenu() {
    this.menuItems = this.appController.productCategories;
    if (this.menuItems.length > 0){
      this.menuItems.push({id:"all",name:"Tất cả"});
      this.selectedMenu = this.menuItems[0];
      for(let i = 0 ; i< this.menuItems.length; i++){
        var item: MenuItem ={
          id:this.menuItems[i].id,
          name: this.menuItems[i].name
        };
        this.menus.push(item);
      }
    }
    
  }

  loadProducts() {
    if(this.selectedMenu.id == "all"){
      this.products = this.appController.products;
      return;
    }

    this.products = this.appController.products.filter(elm => {
      return (elm.category == this.selectedMenu.id && (this.keyword == "" || (this.keyword && elm.keyword.includes(this.keyword.toLowerCase()))));
    })
    console.log("load product", this.products);
  }

  search(keyword) {
    this.keyword = keyword;
    this.loadProducts();
  }
  doRefresh(refresher){
    setTimeout(() => {
      this.loadProducts();
      refresher.complete();
    }, 1000);
  }

  selectMenu(menu) {
    let index = this.menuItems.findIndex(elm=>{
      return elm.id == menu;
    });
    if(index > -1){
      this.selectedMenu = this.menuItems[index];
      this.loadProducts();
    }
    
  }


}
