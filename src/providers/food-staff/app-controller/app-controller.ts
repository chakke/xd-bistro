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

import { Map as UIMap } from '../classes/map';
import { MapPool } from '../object-pools/map-pool';
import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from '../firebase-service/firebase-service';
import { Product, FoodOrder } from '../classes/product';
import { ProductPool } from '../object-pools/product-pool';
import { ProductSize, ProductType, ProductUnit, ProductCategory } from '../interfaces/product';

import { ScrollController } from '../../scroll-controller';
import { Floor } from '../classes/floor';
import { FoodOrderPool } from '../object-pools/food-order-pool';
import { Utils } from '../../app-utils';

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
    productSize: false,
    productSale: false,
    productOption: false,
    table: false,
    order: false,
    area: false,
    staff: false,
    foodOrder: false
  }

  user: User;
  userPool: UserPool;
  staffes: Array<User> = [];
  staffCollection: Map<string, User> = new Map<string, User>();
  restid = "bistro";

  tableInOrders: Array<TableInOrder> = [];
  tableInOrderPool: TableInOrderPool;
  tableCollection: Map<string, Table> = new Map<string, Table>();

  orders: Array<Order> = [];
  orderPool: OrderPool;
  orderCollection: Map<string, Order> = new Map<string, Order>();

  foodOrders: Array<FoodOrder> = [];
  foodOrderPool: FoodOrderPool;
  foodOrderCollection: Map<string, FoodOrder> = new Map<string, FoodOrder>();

  chefFoodOrders: Array<FoodOrder> = [];
  // chefFoodOrderCollection: Map<string, FoodOrder> = new Map<string, FoodOrder>();

  maps: Array<UIMap> = [];
  mapPool: MapPool;


  //Product
  products: Array<Product> = [];
  productPool: ProductPool;
  totalProduct = 1000;
  productCollection: Map<string, Product> = new Map<string, Product>();

  productCategories: Array<ProductCategory> = [];
  productSizes: Array<ProductSize> = [];

  productTypes: Array<ProductType> = [];
  productUnits: Array<ProductUnit> = [];

  //Table
  tables: Array<Table> = [];
  tablePool: TablePool;
  totalTable: 500;

  //Floor
  floors: Array<Floor> = [];
  floorCollection: Map<string, Floor> = new Map<string, Floor>();

  //Kênh youtube của các đối tượng. Mỗi khi ra video mới sẽ bật thông báo cho các thành viên đã đăng kí.
  loadedDataChanel: Subject<string> = new Subject<string>();
  tableChanel: Subject<string> = new Subject<string>();
  productChanel: Subject<string> = new Subject<string>();
  menuChanel: Subject<Array<Menu>> = new Subject<Array<Menu>>();
  userChanel: Subject<User> = new Subject<User>();
  orderChanel: Subject<string> = new Subject<string>();
  foodOrderChanel: Subject<string> = new Subject<string>();

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

    this.foodOrderPool = new FoodOrderPool();
    this.foodOrderPool.initialize(1000);

    this.mapPool = new MapPool();
    this.loadMaps();

    this.productPool = new ProductPool();
    this.productPool.initialize(this.totalProduct);

    this.tablePool = new TablePool();
    this.tablePool.initialize(this.totalTable);

    //Mapping data    
    this.loadedDataChanel.asObservable().subscribe((data) => {
      let dataChange = [];
      //Mapping table to order
      if ((data == "order" || data == "table") && this.loadedData.order && this.loadedData.table) {
        this.orders = this.orders.map(order => {
          if (order.tableIds) {
            order.tables = [];
            order.tableIds.forEach(id => {
              order.tables.push(this.tableCollection.get(id));
            });
          }
          return order;
        })
        dataChange.push("order");

      }

      // Mapping staff to order
      if ((data == "order" || data == "staff") && this.loadedData.order && this.loadedData.staff) {
        this.orders = this.orders.map(order => {
          if (order.staffId) {
            order.staffName = this.staffCollection.get(order.staffId).name;
          }
          return order;
        })
        dataChange.push("order");
      }

      //Mapping area to order
      if ((data == "order" || data == "area") && this.loadedData.order && this.loadedData.area) {
        this.orders = this.orders.map(order => {
          if (order.areaId) {
            order.areaName = this.floorCollection.get(order.areaId).name;
          }
          return order;
        })
        dataChange.push("order");
      }

      //Mapping foodOrder to order and chefFoodOrder
      if ((data == "foodOrder") && this.loadedData.order && this.loadedData.foodOrder) {
        console.log("food order change");
        this.chefFoodOrders = [];
        this.foodOrders.forEach(foodOrder => {
          if (foodOrder.orderId && this.orderCollection.get(foodOrder.orderId)) {
            let order = this.orderCollection.get(foodOrder.orderId);
            let index = order.foods.findIndex(elm => {
              return elm.id == foodOrder.id;
            })
            if (index > -1) {
              this.orderCollection.get(foodOrder.orderId).totalPrice += foodOrder.price * (order.foods[index].amountOrder - foodOrder.amountOrder);
              Utils.copyObject(foodOrder, order.foods[index]);
            } else {
              order.foods.push(foodOrder);
              this.orderCollection.get(foodOrder.orderId).totalPrice += foodOrder.price * foodOrder.amountOrder;
            }

          }
          if (foodOrder.foodId) {
            foodOrder.food = this.productCollection.get(foodOrder.foodId);
          }
          if (foodOrder.foodId) {
            let index = this.chefFoodOrders.findIndex(elm => {
              return elm.foodId == foodOrder.foodId && elm.state == foodOrder.state;
            })
            if (index >= 0) {
              this.chefFoodOrders[index].amountOrder += foodOrder.amountOrder;
            } else {
              this.chefFoodOrders.push(foodOrder);
            }
          }
        })
        dataChange.push("order");
        dataChange.push("foodOrder");
      }

      if (dataChange.indexOf("order") >= 0) {
        this.orderChanel.next("data Change");
      }
      if (dataChange.indexOf("foodOrder") >= 0) {
        this.foodOrderChanel.next("data changed");
      }
    })



    //Test
    // if (this.isTesting) {
    //   this.loadOrder();
    //   this.loadTableInOrder();
    //   this.user = this.userPool.getItem(1);
    //   this.user.id = "1";
    //   this.getMenu();
    // }
  }

  getScrollController() {
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
        this.loginSuccess(email)
      }, error => {
        reject("Đăng nhập thất bại " + error.code);
        console.log(error);
      })
    })
  }

  logout() {
    this.user = null;
  }

  loginSuccess(email: any) {
    if (email) {
      //Get restaurant
      this.restid = "bistro";

      //Get user detail 
      this.firebaseService.getUserInRestaurant(email).then(data => {
        if (data && data.length > 0) {
          this.user = this.userPool.getItemWithData(data[0]);
          this.userChanel.next(this.user);

          //Get menu by user role
          this.getMenu();

          //Get all Staff in restaurant
          this.fetchStaff();

          //Get all product in restaurant
          this.fetchProduct();
          //Get all product option in restaurant
          this.fetchProductOption();
          //Get all product sale in restaurant
          this.fetchProductSales();
          //Get all product size in restaurant
          this.fetchProductSize();
          //Get all product type in restaurant
          this.fetchProductType();
          //Get all product unit in restaurant
          this.fetchProductUnit();
          //Get all product category in restaurant
          this.fetchProductCategory();

          //Get all table in restaurant
          this.fetchTable();

          //Get all order in restaurant
          this.fetchOrder();

          //Get all FoodOrder
          this.fetchFoodOrder();

          //Get all area in restaurant
          this.fetchArea();
        }
      }, error => {
        console.log("get user error", error);
      })
    }
  }

  fetchStaff() {
    //Fetch product
    this.firebaseService.fetchAllStaffInRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let staffData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let staff = this.userPool.getItem(0);
          staff.mappingFirebaseData(staffData);
          staff.id = change.doc.id;
          this.staffes.push(staff);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.staffes.findIndex(elm => {
            return elm.id == staffData.id;
          })
          if (index > -1) {
            this.staffes[index].mappingFirebaseData(staffData);
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.staffes.findIndex(elm => {
            return elm.id == staffData.id;
          })
          if (index > -1) {
            this.staffes.splice(index, 1);
          }
        }
      });
      this.staffes.forEach(staff => {
        this.staffCollection.set(staff.id, staff);
      })
      console.log("staff change", this.staffes);
      this.loadedData.staff = true;
      this.loadedDataChanel.next("staff");
    })
  }

  fetchProduct() {
    //Fetch product
    this.firebaseService.fetchAllProductInRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let foodData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let product = this.productPool.getItem();
          product.mappingFirebaseData(foodData);
          product.id = change.doc.id;
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
      this.products.forEach(product => {
        this.productCollection.set(product.id, product);
      })

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
            firebaseId: categoryData.firebase_id,
            firebaseReference: categoryData.firebase_reference,
            name: categoryData.name,
            en: categoryData.en_name,
            vie: categoryData.name
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
              firebaseId: categoryData.firebase_id,
              firebaseReference: categoryData.firebase_reference,
              name: categoryData.name,
              en: categoryData.en_name,
              vie: categoryData.name
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
          table.id = change.doc.id;
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
      this.tables.forEach(table => {
        this.tableCollection.set(table.id, table);
      })

      this.loadedData.table = true;
      this.tableChanel.next("Lệ rơi vừa ra video mới!");
      this.loadedDataChanel.next("table");
      console.log("tables fetched successfully", this.tables);
    })
  }

  fetchOrder() {
    //Fetch order
    this.firebaseService.fetchAllOrderRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let orderData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let order = this.orderPool.getItem();
          order.mappingFirebaseData(orderData);
          order.id = change.doc.id;
          this.orders.push(order);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.orders.findIndex(elm => {
            return elm.id == orderData.id;
          })
          if (index > -1) {
            this.orders[index].mappingFirebaseData(orderData);
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.orders.findIndex(elm => {
            return elm.id == orderData.id;
          })
          if (index > -1) {
            this.orders.splice(index, 1);
          }
        }
      });
      this.orders.forEach(order => {
        this.orderCollection.set(order.id, order);
      })

      this.loadedData.order = true;
      // this.orderChanel.next("Tùng Sơn vừa ra video mới!");
      this.loadedDataChanel.next("order");
      console.log("ordes fetched successfully", this.orders);
    })
  }

  fetchFoodOrder() {
    //Fetch order
    this.firebaseService.fetchAllFoodOrderInRestaurant(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let foodOrderData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let foodOrder = this.foodOrderPool.getItem();
          foodOrder.mappingFirebaseData(foodOrderData);
          foodOrder.id = change.doc.id;
          this.foodOrders.push(foodOrder);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.foodOrders.findIndex(elm => {
            return elm.id == foodOrderData.id;
          })
          if (index > -1) {
            this.foodOrders[index].reset();
            this.foodOrders[index].mappingFirebaseData(foodOrderData);
          }
          console.log("food order change: ", this.foodOrders[index], foodOrderData);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.orders.findIndex(elm => {
            return elm.id == foodOrderData.id;
          })
          if (index > -1) {
            this.foodOrders.splice(index, 1);
          }
        }
      });
      this.foodOrders.forEach(foodOrder => {
        this.foodOrderCollection.set(foodOrder.id, foodOrder);
      })

      this.loadedData.foodOrder = true;
      this.loadedDataChanel.next("foodOrder");
      console.log("ordes fetched successfully", this.orders);
    })
  }

  fetchArea() {
    this.firebaseService.fetchAreas(this.restid).subscribe(data => {
      data.docChanges.forEach(change => {
        let areaData = change.doc.data();
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.ADD) {
          let floor: Floor = new Floor();
          floor.mappingFirebaseData(areaData);
          floor.id = change.doc.id;
          this.floors.push(floor);
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.MODIFY) {
          let index = this.floors.findIndex(elm => {
            return elm.id == areaData.id;
          })
          if (index > -1) {
            this.floors[index].mappingFirebaseData(areaData);
          }
        }
        if (change.type == FIREBASE_CONST.DOCUMENT_CHANGE_TYPE.REMOVE) {
          let index = this.floors.findIndex(elm => {
            return elm.id == areaData.id;
          })
          if (index > -1) {
            this.floors.splice(index, 1);
          }
        }
      });

      this.floors.forEach(floor => {
        this.floorCollection.set(floor.id, floor);
      })

      this.loadedData.area = true;
      this.loadedDataChanel.next("area");
      console.log("floors fetched successfully", this.productTypes);
    })
  }

  getMenu() {
    if (this.user) {
      this.httpService.getMenu(this.user.staffRole).then(data => {
        if (data && data.menu) {
          console.log("get menu success", this.user.staffRole, data.menu);
          this.menuItems = [];
          data.menu.forEach(element => {
            let menu = new Menu(element.id, element.name, element.icon, false, element.page, element.link);
            this.menuItems.push(menu);
          });
          this.menuChanel.next(this.menuItems);
        }
      })
    }
  }

  addOrder(order: Order): Promise<any> {
    return this.firebaseService.addOrder(this.restid, order);
  }

  addFoodOrder(orderId: string, product: FoodOrder): Promise<any> {
    product.timeCreate = new Date();
    return this.firebaseService.addFoodOrder(this.restid, orderId, this.user.id, product);
  }

  updateFoodOrder(product: FoodOrder): Promise<any> {
    return this.firebaseService.updateFoodOrder(this.restid, this.user.id, product);
  }

  updateProduct(firebaseId: string, value) {
    return this.firebaseService.updateProduct(this.restid, firebaseId, value);
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
