import { ObjectPool } from "./object-pool";
import { Table, TableInOrder } from "../classes/table";

export class TablePool extends ObjectPool<Table> {
    constructor() {
        super();
    }

    createNewItem() {
        return new Table();
    }

    getItemWithData(data: any) {

    }
}

export class TableInOrderPool extends ObjectPool<TableInOrder> {
    constructor() {
        super();
    }

    createNewItem() {
        return new TableInOrder();
    }

    getItemWithData(data: any): TableInOrder {
        let table = this.getItem();
        if(data.hasOwnProperty("id")) table.id = data.id; 
        if(data.hasOwnProperty("name")) table.name = data.name; 
        if(data.hasOwnProperty("max_person")) table.maxPerson = data.max_person; 
        if(data.hasOwnProperty("current_person")) table.currentPerson = data.current_person; 
        if(data.hasOwnProperty("status")) table.status = data.status; 
        if(data.hasOwnProperty("orders")) table.orders = data.orders; 
        if(data.hasOwnProperty("staffs")) table.staffs = data.staffs;  
        return table;
    }
}
