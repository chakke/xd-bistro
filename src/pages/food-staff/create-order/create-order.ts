import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
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
  floors: Array<Floor> = [];
  selectedFloor: Floor;
  tableCollection: Map<number, Array<Table>> = new Map<number, Array<Table>>();
  showTables: Array<Table> = [];
  showingTableList = false;
  viewMode: number = 0;
  selectedTable: Table;

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
    for (let i = 0; i < 4; i++) {
      let floor = new Floor(i + 1, 1, "Tầng " + (i + 1));
      this.floors.push(floor);
    }
    this.selectedFloor = this.floors[0];
    for (let i = 0; i < this.floors.length; i++) {
      let tables = [];
      for (let j = 0; j < 30 + i; j++) {
        let table = new Table();
        table.id = i * (30 + i) + (j + 1) + "";
        table.name = "A" + (+table.id < 10 ? "0" + table.id : table.id);
        table.status = Math.floor(Math.random() * 2 + 2);
        tables.push(table);
      }
      this.tableCollection.set(this.floors[i].id, tables);
      this.showTables = this.tableCollection.get(this.selectedFloor.id);
    }

    this.selectedMap = new MyMap(0, 0, "Map 1", []);
  }

  ionViewDidLoad() {
    this.backdropRef.nativeElement.addEventListener('click', () => {
      this.viewCtrl.dismiss();
    })
    this.sizeHolder = this.sizeHolderRef.nativeElement;
  }

  ionViewDidEnter() {
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

  checkForm() {

  }

  selectFloor(floor: Floor) {
    this.selectedFloor = floor;
    this.showTables = this.tableCollection.get(floor.id);
  }

  showTableList() {
    this.showingTableList = true;
  }
  hideTableList() {
    this.showingTableList = false;
  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode;
  }

  selectTable(table: Table) {
    this.showingTableList = false;
    this.selectedTable = table;
  }

}
