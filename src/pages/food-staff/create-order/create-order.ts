import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Floor } from '../../../providers/food-staff/classes/floor';
import { Table } from '../../../providers/food-staff/classes/table';
import { Map as MyMap } from "../../../providers/food-staff/classes/map";
import { Utils } from "../../../providers/app-utils";
import { IComponentType } from "../../../providers/food-staff/interfaces/i-component-type";
import { UIComponent } from '../../../providers/food-staff/classes/ui-component';
import { DomSanitizer } from '@angular/platform-browser';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { Order } from '../../../providers/food-staff/classes/order';
import { ORDER_STATE, TABLE_STATE, TABLE_STATUS, ComponentType } from '../../../providers/food-staff/app-constant';

@IonicPage()
@Component({
  selector: 'page-create-order',
  templateUrl: 'create-order.html',
})
export class CreateOrderPage {
  @ViewChild("backdrop") backdropRef: ElementRef;
  @ViewChild("sizeHolder") sizeHolderRef: ElementRef;
  sizeHolder: HTMLElement;
  createOrderForm: FormGroup;
  numberOfPerson = 1;
  custormerName = "";
  custormerPhone = "";
  floors: Array<Floor> = [];
  selectedFloor: Floor;
  tableCollection: Map<string, Array<Table>> = new Map<string, Array<Table>>();
  showTables: Array<Table> = [];
  showingTableList = false;
  viewMode: number = 0;

  order: Order = new Order();

  errorMessage: string = "";

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
  tableStatusData = [];

  constructor(
    public mChangeDetectorRef: ChangeDetectorRef,

    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private appController: AppControllerProvider,
    private platform: Platform,
    public domSanitizer: DomSanitizer) {
    this.createOrderForm = this.formBuilder.group({
      number: ["", Validators.required],
      name: [""],
      phone: [""]
    });

    this.selectedMap = new MyMap("0", "0", "Map 1", []);
    this.order.timeCreate = new Date();
    this.order.staffId = this.appController.user.id;
    this.order.staffAvatar = this.appController.user.avatar;
    this.order.staffName = this.appController.user.name;
    this.order.state = ORDER_STATE.CREATED;
    for (const key in TABLE_STATUS) {
      if (TABLE_STATUS.hasOwnProperty(key)) {
        const element = TABLE_STATUS[key];
        this.tableStatusData.push(element);
      }
    }
  }

  ionViewDidLoad() {
    this.floors = this.appController.floors;
    this.selectedFloor = this.floors[0];

    this.maps = this.appController.maps;
    this.selectedMap = this.maps[0];
    this.backdropRef.nativeElement.addEventListener('click', () => {
      this.viewCtrl.dismiss();
    })
    this.loadTables();
    this.appController.tableChanel.asObservable().subscribe(() => {
      this.loadTables();
    })
    this.sizeHolder = this.sizeHolderRef.nativeElement;
    this.onResize();
    this.platform.resize.subscribe(() => {
      this.onResize();
    });
  }

  ionViewDidEnter() {

  }

  loadTables() {
    let tables = this.appController.tables;
    
    for (let i = 0; i < this.floors.length; i++) {
      let tables = [];
      let floorId = this.floors[i].id;
      tables = this.appController.tables.filter(table => {
        table["selected"] = false;
        return table.areaId == floorId;
      })
      this.tableCollection.set(this.floors[i].id, tables);
      this.showTables = this.tableCollection.get(this.selectedFloor.id);
    }

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


  selectFloor(floor: Floor) {
    this.selectedFloor = floor;
    this.showTables = this.tableCollection.get(floor.id); 
  }

  showTableList() {
    this.showingTableList = true;
  }
  hideTableList() {
    //hide table list
    this.showingTableList = false;
  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode; 
  }

  selectTable(table: Table) {
    if (table.status == TABLE_STATE.NO_ORDER + "") {
      let index = this.order.tableIds.indexOf(table.id);
      if (index > -1) {
        this.order.tableIds.splice(index, 1);
        this.order.tables.splice(index, 1);
        table["selected"] = false;
      } else {
        this.order.tableIds.push(table.id);
        this.order.tables.push(table);
        table["selected"] = true;
        this.order.areaId = this.selectedFloor.id;
        this.order.areaName = this.selectedFloor.name;
      }
    }

  }
  isClickSelectNumberPerson: boolean = false;
  selectNumberPerson(){
    if(!this.isClickSelectNumberPerson)this.isClickSelectNumberPerson = true;
  }
  updateNumberOfPerson(number) { 
    if (!number || number == 0) {
      this.numberOfPerson = 0;
      this.mChangeDetectorRef.detectChanges();
      this.numberOfPerson = 1;
    } else {
      this.numberOfPerson = number;
    }
    this.mChangeDetectorRef.detectChanges();
    this.order.numberCustormer = number; 
  }

  createOrder() {
    if (this.checkForm()) {
      this.appController.showLoading();
      this.order.custormerName = this.custormerName;
      this.order.custormerPhone = this.custormerPhone; 
      this.appController.addOrder(this.order).then(data => { 
        //Update table state
        this.order.tableIds.forEach(id => {
          this.appController.updateTable(id, {
            state: TABLE_STATE.HAS_ORDER
          })
        })
        this.appController.hideLoading();
        this.viewCtrl.dismiss();
      }, error => { 
        this.appController.hideLoading();
        this.viewCtrl.dismiss();
      })
    }
  }

  checkForm() {
    if (this.order.tableIds.length == 0) {
      this.errorMessage = "Bạn phải chọn ít nhất 1 bàn";
      return false;
    }
    if(!this.isClickSelectNumberPerson){
      this.errorMessage = "Bạn chưa chọn số lượng người";
      return false;
    }
    if (!(this.order.numberCustormer > 0)) {
      this.errorMessage = "Số lượng người phải lớn hơn 0";
      return false;
    }

    this.errorMessage = "";
    return true;
  }

  cancelOrder() { 
    this.viewCtrl.dismiss();
  }
  cancelTable() {
    this.order.tables.forEach(table => {
      table["selected"] = false;
    })
    this.order.tables = [];
    this.order.tableIds = [];
    this.hideTableList();
  }

  selectMap(map: MyMap) {
    this.selectedMap = map;
    this.onResize();
  }

  selectComponent(component) {
    if (component.table) {
      if (component.table.status == TABLE_STATE.NO_ORDER) {
        let table = component.table;
        let index = this.order.tableIds.indexOf(table.id);
        if (index > -1) {
          this.order.tableIds.splice(index, 1);
          this.order.tables.splice(index, 1);
          table["selected"] = false;

        } else {
          this.order.tableIds.push(table.id);
          this.order.tables.push(table);
          table["selected"] = true;
          this.order.areaId = this.selectedFloor.id;
          this.order.areaName = this.selectedFloor.name;
        }
      }
    }
  }

}
