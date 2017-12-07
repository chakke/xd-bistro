import { ObjectPool } from "./object-pool";
import { Order } from "../classes/order";




export class OrderPool extends ObjectPool<Order> {
    constructor() {
        super();
    }

    createNewItem() {
        return new Order();
    }

    getItemWithData(data: any): Order {
        let order = this.getItem();
        if (data.hasOwnProperty("id")) order.id = data.id;
        if (data.hasOwnProperty("code")) order.code = data.code;
        if (data.hasOwnProperty("owner_id")) order.ownerId = data.owner_id;
        if (data.hasOwnProperty("status")) order.status = data.status;
        if (data.hasOwnProperty("foods")) order.foods = data.foods;
        if (data.hasOwnProperty("table_ids")) order.tableIds = data.table_ids;
        if (data.hasOwnProperty("staffs")) order.staffs = data.staffs;
        if (data.hasOwnProperty("time")) order.time = new Date(data.time);
        return order;
    }
}
