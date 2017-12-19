import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Table } from '../../../providers/food-staff/classes/table';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { TABLE_STATUS, MAP_RATIO, ComponentType } from '../../../providers/food-staff/app-constant';
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
  sizeHolder: HTMLElement;

  viewMode: number = 0;
  searchKeyword: string = "";
  placholder = "Tìm kiếm bàn";
  tableStatus: string = "0";
  tableStatusData = [];

  allTables: Array<Table> = [];
  userTables: Array<Table> = [];
  showTables: Array<Table> = [];
  tableCollection: Map<any, Array<Table>> = new Map<any, Array<Table>>();
 
  width = 0;
  height = 0;
  scale = 1;
  rotate = 0;

  mapPadding = 16;

  selectedMap: MyMap;
  selectedComponent: UIComponent;
  defaultWidth = 50;
  defaultHeight = 50;

  floors = [
    { id: 1, name: "Tầng 1" },
    { id: 2, name: "Tầng 2" },
    { id: 3, name: "Tầng 3" },
    { id: 4, name: "Tầng 4" }
  ]

  selectedFloor = 1;

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
    this.selectedMap = new MyMap(0, 0, "Map 1", []);
  }

  ionViewDidLoad() {
    this.loadTables();
    this.sizeHolder = this.sizeHolderRef.nativeElement;
  }
  ionViewDidEnter() {
    this.selectedMap = this.appController.maps[0];
    this.selectedMap.components.map(elm=>{
      console.log(elm);
      // if(elm.getIcon()){
      //   elm.innerHtml = `<ion-icon name="${elm.getIcon()}"></ion-icon>`;
      // }
      return elm;
    })
    this.onResize();
    this.platform.resize.subscribe(() => {
      this.onResize();
    });
  }

  onResize() {
    let maxWidth = this.sizeHolder.offsetWidth - 2* this.mapPadding;
    let maxHeight = this.sizeHolder.offsetHeight - 2* this.mapPadding;
    let ratio = maxWidth / maxHeight;

     this.width = this.selectedMap.getWidth();
    this.height = this.selectedMap.getHeight();

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
  }

  search() {
    this.showTables = this.allTables.filter(table => {
      return (table.status == this.tableStatus || +this.tableStatus == TABLE_STATUS.ALL.id) && table.name.toLowerCase().includes(this.searchKeyword.trim().toLowerCase())
    })
    console.log("Hello from the other side", this.searchKeyword, this.showTables);
  }

  loadTables() {
    this.allTables = this.appController.tables;
    this.allTables.forEach(table => {
      let orders = [];
      // table.orders.forEach(shortOrder => {
      //   let order = this.appController.getOrderById(shortOrder.id);
      //   orders.push(order);
      // });
      // table.orders = orders;
      // (<any>table)["missingFoods"] = this.getMissingFoods((<any>table).orders);
    });
    this.userTables = this.allTables.filter(table => {
      // return table.staffs.indexOf(this.appController.user.id) > -1;
    })
    this.userTables = this.userTables.sort((a, b) => {
      return +a.status - +b.status;
    })
    this.filterTable();
  }

  filterTable() {
    console.log("filter table", this.tableStatus);

    this.tableCollection.clear();
    this.tableStatusData.forEach(element => {
      this.tableCollection.set(element.id, this.allTables.filter(table => {
        return element.id == TABLE_STATUS.ALL.id || table.status == element.id;
      }));
    });

    this.showTables = this.tableCollection.get(+this.tableStatus);
    console.log(this.tableCollection, this.userTables);
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

  selectFloor(floorId: number) {
    this.selectedFloor = floorId;
  }
}
