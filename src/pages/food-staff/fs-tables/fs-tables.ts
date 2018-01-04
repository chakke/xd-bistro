import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content } from 'ionic-angular';
import { Table } from '../../../providers/food-staff/classes/table';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { TABLE_STATUS, MAP_RATIO, ComponentType, TABLE_STATE } from '../../../providers/food-staff/app-constant';
import { OrderInTable } from '../../../providers/food-staff/interfaces/order-in-table';
import { Order } from '../../../providers/food-staff/classes/order';
import { Map as MyMap } from "../../../providers/food-staff/classes/map";
import { Utils } from "../../../providers/app-utils";
import { IComponentType } from "../../../providers/food-staff/interfaces/i-component-type";
import { UIComponent } from '../../../providers/food-staff/classes/ui-component';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-fs-tables',
  templateUrl: 'fs-tables.html',
})

export class FsTablesPage {
  @ViewChild("sizeHolder") sizeHolderRef: ElementRef;
  @ViewChild(Content) content: Content;
  sizeHolder: HTMLElement;

  viewMode: number = 0;
  searchKeyword: string = "";
  placholder = "Tìm kiếm bàn";
  tableStatus: string = "-1";
  tableStatusData = [];

  allTables: Array<Table> = [];
  userTables: Array<Table> = [];
  showTables: Array<Table> = [];
  showUserTable: Array<Table> = [];
  tableCollection: Map<any, Array<Table>> = new Map<any, Array<Table>>();

  width = 0;
  height = 0;
  scale = 1;
  rotate = 0;

  mapPadding = 16;
  maps: Array<MyMap> = [];
  selectedMap: MyMap;
  selectedComponent: UIComponent;
  defaultWidth = 50;
  defaultHeight = 50;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider,
    public platform: Platform,
    public domSanitizer: DomSanitizer) {
    for (const key in TABLE_STATUS) {
      if (TABLE_STATUS.hasOwnProperty(key)) {
        const element = TABLE_STATUS[key];
        this.tableStatusData.push(element);
      }
    }
    this.selectedMap = new MyMap("0", "0", "Map 1", []);
  }

  ionViewDidLoad() {
    this.loadTables();
    this.appController.tableChanel.asObservable().subscribe(() => {
      this.loadTables();
    })
    this.sizeHolder = this.sizeHolderRef.nativeElement;
  }
  ionViewDidEnter() { 
    this.appController.showLoading("xx", "ss");
    this.maps = this.appController.maps;
    this.selectedMap = this.appController.maps[0];
    this.onResize();
    this.platform.resize.subscribe(() => {
      this.onResize();
    });
  }

  onResize() {
    this.selectedMap.components.map(component => {
      component["icon"] = this.getComponentIcon(component.type, component["capacity"]);
      let short = component.width;
      if (component.width > component.height) {
        short = component.height;
      }
      component["iconSize"] = short;
      if (component.table) {
        component.classList.push("status-" + component.table.status);
      }
    })
    let maxWidth = this.sizeHolder.offsetWidth - 2 * this.mapPadding;
    let maxHeight = this.sizeHolder.offsetHeight - 2 * this.mapPadding;
    let ratio = maxWidth / maxHeight;
    if (this.selectedMap.getWidth() > this.selectedMap.getHeight()) {
      this.width = this.selectedMap.getWidth();
      this.height = this.selectedMap.getHeight();
    } else {
      this.width = this.selectedMap.getHeight();
      this.height = this.selectedMap.getWidth();
    }


    //Giả sử rằng map.height < map.width
    if (ratio >= 1) {
      //width > height. No rotate. just scale
      this.scale = maxHeight / this.height;
    } else {
      //width < height.  rotate 90deg and scale
      this.scale = maxWidth / this.height;
      this.rotate = 90;
    }

    let mapContainer = document.getElementById("map-container");
    let map = document.getElementById("map");
    mapContainer.style.transform = `scale(${this.scale})`;
    mapContainer.style.transformOrigin = "top left";
    map.style.transform = `rotate(${this.rotate}deg) `;
    map.style.transformOrigin = `${this.height / 2}px ${this.height / 2}px`;

    // [style.transform]="this.domSanitizer.bypassSecurityTrustStyle('rotateZ('+ rotate +'deg) translateY('+(height)*scale*0+'px) scale('+ scale +')')"
    // let resizeRatio = (this.width - 2 * this.mapPadding) / this.selectedMap.getHeight();
    // console.log("before", resizeRatio, this.width, this.selectedMap.getHeight());
    // this.selectedMap.components.map(component => {
    //   let lastX = component.x;
    //   let lastY = component.y;
    //   let lastWidth = component.width;
    //   let lastHeight = component.height;
    //   let rotateInRadians = (component.rotate + 90) * Math.PI / 180;
    //   let sin = Math.sin(rotateInRadians);
    //   let cos = Math.cos(rotateInRadians);

    //   console.log("sincos", Math.round(sin * 100) / 100, Math.round(cos * 100) / 100);

    //   // component.width = cos * lastWidth + sin * lastHeight;
    //   // component.height = cos * lastHeight + sin* lastWidth;

    //   component.x = this.selectedMap.getHeight() - lastY - lastHeight;
    //   component.y = lastX;
    //   [component.width, component.height] = [component.height, component.width];

    //   component.x *= resizeRatio;
    //   component.y *= resizeRatio;
    //   component.width *= resizeRatio;
    //   component.height *= resizeRatio;
    //   // component.rotate = 0;
    // });
    // console.log("after", this.selectedMap);
  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode;
    setTimeout(() => {
      this.content.resize();
    }, 80);
  }

  search() {
    this.showTables = this.allTables.filter(table => {
      return (table.status == this.tableStatus || +this.tableStatus == TABLE_STATUS.ALL.id) && table.name.toLowerCase().includes(this.searchKeyword.trim().toLowerCase())
    })
    this.showUserTable = this.userTables.filter(table => {
      return (table.status == this.tableStatus || +this.tableStatus == TABLE_STATUS.ALL.id) && table.name.toLowerCase().includes(this.searchKeyword.trim().toLowerCase())
    })

    console.log("Hello from the other side", this.searchKeyword, this.showTables);
  }

  loadTables() {
    console.log("load tables", this.appController.tables);
    this.allTables = this.appController.tables;
    let orderIds = [];
    let userTableIds = [];
    this.appController.foodOrders.forEach(foodOrder => {
      if (foodOrder.staffId == this.appController.user.id) {
        if (orderIds.indexOf(foodOrder.orderId) == -1) {
          orderIds.push(foodOrder.orderId);
        }
      }
    })
    this.appController.orders.forEach(order => {
      if (order.staffId == this.appController.user.id) {
        if (orderIds.indexOf(order.id) == -1) {
          orderIds.push(order.id);
        }
      }
    })

    orderIds.forEach(id => {
      let order = this.appController.orderCollection.get(id);
      if (order) {
        order.tableIds.forEach(tableId => {
          if (userTableIds.indexOf(tableId) == -1) {
            userTableIds.push({ tableId: tableId, orderId: id });
          }
        })
      }
    });

    userTableIds.forEach(elm => {
      let table = this.appController.tableCollection.get(elm.tableId);
      let order = this.appController.orderCollection.get(elm.orderId);
      table["currentPerson"] = order.numberCustormer;
      table["orderId"] = order.id;
      this.userTables.push(table);
    })

    this.userTables = this.userTables.sort((a, b) => {
      return +b.status - +a.status;
    })
    this.showUserTable = this.userTables;
    this.filterTable();
  }

  filterTable() {
    this.tableCollection.clear();
    this.tableStatusData.forEach(element => {
      this.tableCollection.set(element.id, this.allTables.filter(table => {
        return element.id == TABLE_STATUS.ALL.id || table.status == element.id;
      }));
    });

    this.showTables = this.tableCollection.get(+this.tableStatus);
  }

  getOrderIds(orders: Array<OrderInTable>) {
    let result = "";
    if (orders && orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        result += orders[i].code + ", ";
      }
    }
    result = result.substr(0, result.length - 2);
    return result;
  }

  getMissingFoods(orders: Array<Order>) {
    let missingFoods = 0;
    if (orders && orders.length > 0) {
      for (let i = 0; i < orders.length; i++) {
        // let foods = orders[i].foods;
        // for (let j = 0; j < foods.length; j++) {
        //   if (foods[j].quantityInOrder > foods[j].quantityInTable) {
        //     missingFoods++;
        //   }
        // }
      }
    }
    return missingFoods;
  }

  getTableStatusById(id: number) {
    let index = this.tableStatusData.findIndex(elm => {
      return elm.id == id;
    })
    if (index) return this.tableStatusData[index].name;
  }

  selectMap(map) {
    this.selectedMap = map;
    this.onResize();
  }

  gotoOrderDetail(orderId) {
    this.appController.pushPage("OrderDetailPage", { orderId: orderId });
  }

  getComponentIcon(type, capacity) {
    switch (type.type) {
      case ComponentType.TABLE.type: {
        if (capacity && capacity >= 6) {
          return "fs-family-table";
        } else {
          return "fs-couple-table";
        }
      }
      case ComponentType.WC.type: {
        return "fs-wc";
      }
      case ComponentType.BAR.type: {
        return "fs-bar";
      }
      case ComponentType.STAIR.type: {
        return "fs-stairs";
      }
      case ComponentType.KITCHEN.type: {
        return "fs-kitchen";
      }
    }

  }

  selectComponent(component) {
    if (component.table.status == TABLE_STATE.HAS_ORDER) {
      let orderResult = this.appController.orders.find(order => {
        return order.tableIds.indexOf(component.table.id) > -1;
      });
      if (orderResult) {
        this.gotoOrderDetail(orderResult.id);
      }
    }
  }

  selectTable(table) {
    if (table.status == TABLE_STATE.HAS_ORDER) {
      let orderResult = this.appController.orders.find(order => {
        return order.tableIds.indexOf(table.id) > -1;
      });
      if (orderResult) {
        this.gotoOrderDetail(orderResult.id);
      }
    }
  }
}
