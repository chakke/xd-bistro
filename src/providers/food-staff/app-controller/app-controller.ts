import { Injectable } from '@angular/core';
import { App, ToastController, Toast } from 'ionic-angular';

import { FoodStaffHttpServiceProvider } from "../food-staff-http-service/food-staff-http-service";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { User, Bartender, Chef, Manager, Staff, Waiter } from '../classes/user';
import { Menu } from "../classes/menu";

import { UserPool } from "../object-pools/user-pool";

import { Subject } from 'rxjs/Subject';
import { UserContant } from '../app-constant';

import { TableInOrderPool } from '../object-pools/table-pool';
import { TableInOrder } from '../classes/table';

import { Order } from '../classes/order';
import { OrderPool } from '../object-pools/order-pool';

import { Map } from '../classes/map';
import { MapPool } from '../object-pools/map-pool';
@Injectable()
export class AppControllerProvider {
  isTesting = true;

  toast: Toast;
  menuItems: Array<Menu> = [];

  user: User;
  userPool: UserPool;

  tableInOrders: Array<TableInOrder> = [];
  tableInOrderPool: TableInOrderPool;

  orders: Array<Order> = [];
  orderPool: OrderPool;

  maps: Array<Map> = [];
  mapPool: MapPool;


  menuSubject: Subject<Array<Menu>> = new Subject<Array<Menu>>();
  userSubject: Subject<User> = new Subject<User>();
  constructor(private app: App,
    private facebook: Facebook,
    public afAuth: AngularFireAuth,
    public googlePlus: GooglePlus,
    private toastCtrl: ToastController,
    private httpService: FoodStaffHttpServiceProvider) {
    // initialize pools
    this.userPool = new UserPool();

    this.tableInOrderPool = new TableInOrderPool();
    this.tableInOrderPool.initialize(200);

    this.orderPool = new OrderPool();
    this.orderPool.initialize(200);

    this.mapPool = new MapPool();
    this.loadMaps();

    //Test
    if (this.isTesting) {
      this.loadOrder();
      this.loadTableInOrder();
      this.user = this.userPool.getItem(1);
      this.user.id = 1;
      this.getMenu();
    }
  }

  pushPage(page: any) {
    if (this.setActivePage(page)) {
      this.app.getActiveNav().push(page);
    }
  }

  setRootPage(page: any) {
    if (this.setActivePage(page)) {
      this.app.getActiveNav().setRoot(page);
    }
  }

  setActivePage(page: any) {
    if (page && page != "") {
      let activeIndex = this.menuItems.findIndex(elm => {
        return elm.active;
      })
      if (activeIndex > -1) {
        if (this.menuItems[activeIndex].page == page || this.menuItems[activeIndex].link == page) {
          return false;
        } else {
          this.menuItems[activeIndex].active = false;
        }
      }
      for (let item of this.menuItems) {
        if (item.page == page || item.link == page) {
          item.active = true;
        }
      }
      return true;
    }
    return false;
  }

  loginWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.facebook.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
          let facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(res.authResponse.accessToken);
          this.afAuth.auth.signInWithCredential(facebookCredential).then(success => {
            resolve("Đăng nhập thành công");
            console.log(success);
          }, error => {
            reject("Không thể đăng nhập vào firebase " + error.code);
            console.log(error);
          });
        })
        .catch(e => {
          reject("Không thể đăng nhập vào facebook");
        });
    })
  }

  loginWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googlePlus.login({}).then(res => {
        let googloeCredential = firebase.auth.GoogleAuthProvider
          .credential(null, res.accessToken);

        this.afAuth.auth.signInWithCredential(googloeCredential).then(success => {
          resolve("Đăng nhập thành công");
          console.log(success);
        }, error => {
          reject("Không thể đăng nhập vào firebase " + error.code);
          console.log(error);
        });
      }, error => {
        reject("Không thể đăng nhập vào google")
      })
    })
  }

  loginWithAccountPassword(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(success => {
        resolve("Đăng nhập thành công");
        console.log(success);
        this.loginSuccess({ id: 1, type: UserContant.USER_TYPE.WAITER, isLoggedIn: true, loginMethod: UserContant.LOGIN_METHOD.ACCOUNT, firstName: "Trinh", lastName: "Ngọc" })
      }, error => {
        reject("Đăng nhập thất bại " + error.code);
        console.log(error);
      })
    })
  }

  logout() {
    this.user = null;
  }

  loginSuccess(userData: any) {
    if (userData.type) {
      this.user = this.userPool.getItemWithData(userData);
      this.userSubject.next(this.user);
      this.getMenu();
    }
  }

  getMenu() {
    if (this.user) {
      this.httpService.getMenu(this.user.id).then(data => {
        if (data && data.result == 1 && data.content) {
          this.menuItems = [];
          data.content.forEach(element => {
            let menu = new Menu(element.id, element.name, element.icon, false, element.page, element.link);
            this.menuItems.push(menu);
          });
          this.menuSubject.next(this.menuItems);
        }
      })
    }
  }

  showToast(message: string, duration?: number, position?: string) {
    if (this.toast) this.hideToast();
    this.toast = this.toastCtrl.create({
      message: message,
      duration: (duration ? duration : 3000),
      position: (position ? position : "bottom")
    })
    this.toast.present();
  }

  hideToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }


  loadTableInOrder() {
    this.httpService.getTableInOrder(0).then(data => {
      if (data && data.result == 1 && data.content) {
        this.tableInOrders = [];
        data.content.forEach(element => {
          let table = this.tableInOrderPool.getItemWithData(element);
          this.tableInOrders.push(table);
        });
        console.log("table in order", this.tableInOrders);
      }
    });   
  }

  getAllTableInOrder() {
    return this.tableInOrders;
  }

  getTableById(id): TableInOrder{
    let index = this.tableInOrders.findIndex(elm=>{
      return elm.id == id;
    })
    
    if(index> -1){
      console.log("get table by id",id,  index);
      return this.tableInOrders[index];
    }
    return undefined;
  }

  loadOrder() {
    this.httpService.getCUrrentOrder(0).then(data => {
      if (data && data.result == 1 && data.content) {
        this.orders = [];
        data.content.forEach(element => {
          let order = this.orderPool.getItemWithData(element);
          this.orders.push(order);
        });
      }
    })
  }

  getAllOrders() {
    return this.orders;
  }

  getOrderById(orderId: string): Order {
    let index = this.orders.findIndex(elm => {
      return elm.id == orderId;
    })
    if (index > -1) {
      return this.orders[index];
    }
    return null;
  }

  loadMaps(){
    this.httpService.getAllMap("0").then(data=>{
      if (data && data.result == 1 && data.content) {
        this.maps = [];
        data.content.forEach(element => {
          let map = this.mapPool.getItemWithData(element);
          this.maps.push(map);
        });
      }
    })
  }

}
