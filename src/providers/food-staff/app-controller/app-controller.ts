import { Injectable } from '@angular/core';
import { App, ToastController, Toast, Loading, LoadingController } from 'ionic-angular';

import { FoodStaffHttpServiceProvider } from "../food-staff-http-service/food-staff-http-service";

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { User, Bartender, Chef, Manager, Staff, Waiter } from '../classes/user';
import { Menu } from "../classes/menu";

import { UserPool } from "../object-pools/user-pool";

import { Subject } from 'rxjs/Subject';
import { UserContant, FIREBASE_CONST } from '../app-constant';

import { TableInOrderPool, TablePool } from '../object-pools/table-pool';
import { TableInOrder, Table } from '../classes/table';

import { Order } from '../classes/order';
import { OrderPool } from '../object-pools/order-pool';

import { Map } from '../classes/map';
import { MapPool } from '../object-pools/map-pool';
import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from '../firebase-service/firebase-service';
import { Product } from '../classes/product';
import { ProductPool } from '../object-pools/product-pool';
import { ProductSize, ProductState, ProductType, ProductUnit, ProductCategory } from '../interfaces/product';

import { ScrollController } from '../../scroll-controller';

@Injectable()
export class AppControllerProvider {

  isTesting = true;

  toast: Toast;
  loading: Loading;

  menuItems: Array<Menu> = [];
  loadedData = {
    product: false,
    productCategory: false,
    productUnit: false,
    productType: false,
    productState: false,
    productSize: false,
    productSale: false,
    productOption: false,
    table: false
  }

  user: User;
  userPool: UserPool;
  restid = "bistro";

  tableInOrders: Array<TableInOrder> = [];
  tableInOrderPool: TableInOrderPool;

  orders: Array<Order> = [];
  orderPool: OrderPool;

  maps: Array<Map> = [];
  mapPool: MapPool;


  //Product
  products: Array<Product> = [];
  productPool: ProductPool;
  totalProduct = 1000;

  productCategories: Array<ProductCategory> = [];
  productSizes: Array<ProductSize> = [];
  productStates: Array<ProductState> = [];
  productTypes: Array<ProductType> = [];
  productUnits: Array<ProductUnit> = [];

  //Table
  tables: Array<Table> = [];
  tablePool: TablePool;
  totalTable: 500;

  //Kênh youtube của các đối tượng. Mỗi khi ra video mới sẽ bật thông báo cho các thành viên đã đăng kí.
  loadedDataChanel: Subject<string> = new Subject<string>();
  tableChanel: Subject<string> = new Subject<string>();
  productChanel: Subject<string> = new Subject<string>();
  menuChanel: Subject<Array<Menu>> = new Subject<Array<Menu>>();
  userChanel: Subject<User> = new Subject<User>();

  scrollController: ScrollController = new ScrollController();

  constructor(private app: App,
    private facebook: Facebook,
    public googlePlus: GooglePlus,
    private toastCtrl: ToastController,
    private httpService: FoodStaffHttpServiceProvider,
    private loadingCtrl: LoadingController,
    private firebaseService: FirebaseServiceProvider) {
    // initialize pools
    this.userPool = new UserPool();

    this.tableInOrderPool = new TableInOrderPool();
    this.tableInOrderPool.initialize(200);

    this.orderPool = new OrderPool();
    this.orderPool.initialize(200);

    this.mapPool = new MapPool();
    this.loadMaps();

    this.productPool = new ProductPool();
    this.productPool.initialize(this.totalProduct);

    this.tablePool = new TablePool();
    this.tablePool.initialize(this.totalTable);

    //Test
    if (this.isTesting) {
      this.loadOrder();
      this.loadTableInOrder();
      this.user = this.userPool.getItem(1);
      this.user.id = 1;
      this.getMenu();
    }
  }

  getScrollController(){
    return this.scrollController;
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
          this.firebaseService.loginWithFacebook(res.authResponse.accessToken).then(success => {
            resolve("Đăng nhập bằng facebook thành công");
            console.log(success);
          }, error => {
            resolve("Đăng nhập bằng facebook thất bại. Không thể kết nối đến máy chủ");
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
        this.firebaseService.loginWithGoogle(res.accessToken).then(success => {
          resolve("Đăng nhập google thành công");
          console.log(success);
        }, error => {
          reject("Đăng nhập google thất bại. Không thể kết nối đến máy chủ");
          console.log(error);
        });
      }, error => {
        reject("Không thể đăng nhập vào google")
      })
    })
  }

  loginWithAccountPassword(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseService.loginWithAccountPassword(email, password).then(success => {
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
      this.userChanel.next(this.user);
      this.getMenu();
      this.restid = "bistro";

      this.fetchProduct();
      this.fetchProductOption();
      this.fetchProductSales();
      this.fetchProductSize();
      this.fetchProductState();
      this.fetchProductType();
      this.fetchProductUnit();
      this.fetchProductCategory();

      this.fetchTable();
    }
  }

  fetchProduct() {
    //Fetch product
    this.firebaseService.fetchAllProductInRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let foodData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let product = this.productPool.getItem();
          product.mappingFirebaseData(foodData);
          this.products.push(product);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == foodData.id;
          })
          if (index > -1) {
            this.products[index].mappingFirebaseData(foodData);
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == foodData.id;
          })
          if (index > -1) {
            this.products.splice(index, 1);
          }
        }
      });
      this.loadedData.product = true;
      this.productChanel.next("Treeboo vừa ra video mới!");
      this.loadedDataChanel.next("Hàng mới về");
      console.log("products fetched successfully", this.products);
    })
  }

  fetchProductOption() {
    this.loadedData.productOption = true;
    this.loadedDataChanel.next("Hàng mới về");
  }

  fetchProductSales() {
    this.loadedData.productSale = true;
    this.loadedDataChanel.next("Hàng mới về");
  }

  fetchProductCategory() {
    this.firebaseService.fetchProductCategories(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let categoryData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let category: ProductCategory = {
            id: categoryData.id,
            code: categoryData.code,
            name: categoryData.name,
            en: categoryData.en,
            vie: categoryData.vie
          };
          this.productCategories.push(category);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == categoryData.id;
          })
          if (index > -1) {
            this.productCategories[index] = {
              id: categoryData.id,
              code: categoryData.code,
              name: categoryData.name,
              en: categoryData.en,
              vie: categoryData.vie
            };
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == categoryData.id;
          })
          if (index > -1) {
            this.productCategories.splice(index, 1);
          }
        }
      });
      this.loadedData.productCategory = true;
      this.loadedDataChanel.next("Hàng mới về");
      console.log("productCategory fetched successfully", this.productCategories);
    })
  }

  fetchProductSize() {
    this.firebaseService.fetchProductSizes(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let sizeData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let size: ProductSize = {
            id: sizeData.id,
            code: sizeData.code,
            name: sizeData.name
          };
          this.productSizes.push(size);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == sizeData.id;
          })
          if (index > -1) {
            this.productSizes[index] = {
              id: sizeData.id,
              code: sizeData.code,
              name: sizeData.name
            };
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == sizeData.id;
          })
          if (index > -1) {
            this.productSizes.splice(index, 1);
          }
        }
      });
      this.loadedData.productSize = true;
      this.loadedDataChanel.next("Hàng mới về");
      console.log("productSizes fetched successfully", this.productSizes);
    })
  }

  fetchProductState() {
    this.firebaseService.fetchProductStates(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let stateData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let state: ProductState = {
            id: stateData.id,
            code: stateData.code,
            name: stateData.name
          };
          this.productStates.push(state);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == stateData.id;
          })
          if (index > -1) {
            this.productStates[index] = {
              id: stateData.id,
              code: stateData.code,
              name: stateData.name
            };
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == stateData.id;
          })
          if (index > -1) {
            this.productStates.splice(index, 1);
          }
        }
      });
      this.loadedData.productState = true;
      this.loadedDataChanel.next("Hàng mới về");
      console.log("productStates fetched successfully", this.productStates);
    })
  }

  fetchProductType() {
    this.firebaseService.fetchProductTypes(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let typeData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let type: ProductType = {
            id: typeData.id,
            name: typeData.name
          };
          this.productTypes.push(type);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == typeData.id;
          })
          if (index > -1) {
            this.productTypes[index] = {
              id: typeData.id,
              name: typeData.name
            };
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == typeData.id;
          })
          if (index > -1) {
            this.productTypes.splice(index, 1);
          }
        }
      });
      this.loadedData.productType = true;
      this.loadedDataChanel.next("Hàng mới về");
      console.log("productTypes fetched successfully", this.productTypes);
    })
  }

  fetchProductUnit() {
    this.firebaseService.fetchProductUnits(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let unitData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let unit: ProductSize = {
            id: unitData.id,
            code: unitData.code,
            name: unitData.name
          };
          this.productUnits.push(unit);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == unitData.id;
          })
          if (index > -1) {
            this.productUnits[index] = {
              id: unitData.id,
              code: unitData.code,
              name: unitData.name
            };
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == unitData.id;
          })
          if (index > -1) {
            this.productUnits.splice(index, 1);
          }
        }
      });
      this.loadedData.productUnit = true;
      this.loadedDataChanel.next("Hàng mới về");
      console.log("productUnits fetched successfully", this.productUnits);
    })
  }

  fetchTable() {
    //Fetch product
    this.firebaseService.fetchAllTableRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let tableData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let table = this.tablePool.getItem();
          table.mappingFirebaseData(tableData);
          this.tables.push(table);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.products.findIndex(elm => {
            return elm.id == tableData.id;
          })
          if (index > -1) {
            this.tables[index].mappingFirebaseData(tableData);
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.products.findIndex(elm => {
            return elm.id == tableData.id;
          })
          if (index > -1) {
            this.tables.splice(index, 1);
          }
        }
      });
      this.loadedData.table = true;
      this.tableChanel.next("Lệ rơi vừa ra video mới!");
      this.loadedDataChanel.next("Hàng mới về");
      console.log("tables fetched successfully", this.tables);
    })
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
          this.menuChanel.next(this.menuItems);
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

  showLoading(content?: string) {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: content ? content : "Xin đợi!"
    })
    this.loading.present();
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
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

  getTableById(id): TableInOrder {
    let index = this.tableInOrders.findIndex(elm => {
      return elm.id == id;
    })

    if (index > -1) {
      console.log("get table by id", id, index);
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

  loadMaps() {
    this.httpService.getAllMap("0").then(data => {
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
