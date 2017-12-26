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
        return order;
    }
}
