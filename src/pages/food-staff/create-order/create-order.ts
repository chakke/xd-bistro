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
import { ORDER_STATE, TABLE_STATE } from '../../../providers/food-staff/app-constant';

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
  numberOfPerson = 2;
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

  selectedMap: MyMap;
  selectedComponent: UIComponent;
  defaultWidth = 50;
  defaultHeight = 50;

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

    this.floors = this.appController.floors;
    this.selectedFloor = this.floors[0];
    for (let i = 0; i < this.floors.length; i++) {
      let tables = [];
      let floorId = this.floors[i].id;
      tables = this.appController.tables.filter(table => {
        return table.areaId == floorId;
      })
      this.tableCollection.set(this.floors[i].id, tables);
      this.showTables = this.tableCollection.get(this.selectedFloor.id);
    }

    this.selectedMap = new MyMap("0", "0", "Map 1", []);
    this.order.timeCreate = new Date();
    this.order.staffId = this.appController.user.id;
    this.order.staffAvatar = this.appController.user.avatar;
    this.order.staffName = this.appController.user.name;
    this.order.state = ORDER_STATE.CREATED;
  }

  ionViewDidLoad() {
    this.backdropRef.nativeElement.addEventListener('click', () => {
      this.viewCtrl.dismiss();
    })
    this.sizeHolder = this.sizeHolderRef.nativeElement;
    this.selectedMap = this.appController.maps[0];
    this.selectedMap.components.map(elm => {
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

  ionViewDidEnter() {

  }

  onResize() {
    let maxWidth = this.sizeHolder.offsetWidth - 2 * this.mapPadding;
    let maxHeight = this.sizeHolder.offsetHeight - 2 * this.mapPadding;
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

  updateNumberOfPerson(number) {
    console.log("updateNumberOfPerson", number);

    // if(parseInt(number)==0 || number==undefined || number == "" || number == null)number =  1;
    if (!number || number == 0) {
      this.numberOfPerson = 0;
      this.mChangeDetectorRef.detectChanges();
      this.numberOfPerson = 10; 
    } else {
      this.numberOfPerson = number;
    }
    this.mChangeDetectorRef.detectChanges();

    this.order.numberCustormer = number;
    console.log("thisnumberperson", this.numberOfPerson);

  }

  createOrder() {
    if (this.checkForm()) {
      this.appController.showLoading();
      this.order.custormerName = this.custormerName;
      this.order.custormerPhone = this.custormerPhone;
      console.log("create order", this.order);
      this.appController.addOrder(this.order).then(data => {
        console.log("add order success");
        //Update table state
        this.order.tableIds.forEach(id => {
          this.appController.updateTable(id, {
            state: TABLE_STATE.HAS_ORDER
          })
        })
        this.appController.hideLoading();
        this.viewCtrl.dismiss();
      }, error => {
        console.log("add order fail");
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
    if (!(this.order.numberCustormer > 0)) {
      this.errorMessage = "Số lượng người phải lớn hơn 0";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  cancelOrder() {
    console.log("cancel order");
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
}
