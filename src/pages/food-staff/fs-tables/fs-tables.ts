import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TableInOrder, } from '../../../providers/food-staff/classes/table';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';
import { TABLE_STATUS } from '../../../providers/food-staff/app-constant';
import { OrderInTable } from '../../../providers/food-staff/interfaces/order-in-table';
import { Order } from '../../../providers/food-staff/classes/order';


@IonicPage()
@Component({
  selector: 'page-fs-tables',
  templateUrl: 'fs-tables.html',
})
export class FsTablesPage {
  viewMode: number = 0;
  searchKeyword: string = "";
  placholder = "Tìm kiếm bàn";
  tableStatus: string = "0";
  tableStatusData = [];

  allTables: Array<TableInOrder> = [];
  userTables: Array<TableInOrder> = [];
  showTables: Array<TableInOrder> = [];
  tableCollection: Map<any, Array<TableInOrder>> = new Map<any, Array<TableInOrder>>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appController: AppControllerProvider) {
    for (const key in TABLE_STATUS) {
      if (TABLE_STATUS.hasOwnProperty(key)) {
        const element = TABLE_STATUS[key];
        this.tableStatusData.push(element);
      }
    }
  }

  ionViewDidLoad() {
    this.loadTables();
  }

  onClickToggleView() {
    this.viewMode = 1 - this.viewMode;
  }

  search() {
    this.showTables = this.allTables.filter(table => {
      return (table.status == +this.tableStatus || +this.tableStatus == 0) && table.name.toLowerCase().includes(this.searchKeyword.trim().toLowerCase())
    })
    console.log("Hello from the other side", this.searchKeyword, this.showTables);
  }

  loadTables() {
    this.allTables = this.appController.getAllTableInOrder();
    this.allTables.forEach(table => {
      let orders = [];
      table.orders.forEach(shortOrder => {
        let order = this.appController.getOrderById(shortOrder.id);
        orders.push(order);
      });
      table.orders = orders;
      (<any>table)["missingFoods"] = this.getMissingFoods((<any>table).orders);
    });
    this.userTables = this.allTables.filter(table => {
      return table.staffs.indexOf(this.appController.user.id) > -1;
    })
    this.userTables = this.userTables.sort((a, b) => {
      return a.status - b.status;
    })
    this.filterTable();
  }

  filterTable() {
    console.log("filter table", this.tableStatus);

    this.tableCollection.clear();
    this.tableStatusData.forEach(element => {
      this.tableCollection.set(element.id, this.allTables.filter(table => {
        return element.id == 0 || table.status == element.id;
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
        let foods = orders[i].foods;
        for (let j = 0; j < foods.length; j++) {
          if (foods[j].quantityInOrder > foods[j].quantityInTable) {
            missingFoods++;
          }
        }
      }
    }
    return missingFoods;
  }

  getTableStatusById(id:number){
    let index = this.tableStatusData.findIndex(elm=>{
      return elm.id == id;
    })
    if(index) return this.tableStatusData[index].name;
  }
}
