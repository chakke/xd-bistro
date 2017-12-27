import { ObjectPool } from "./object-pool";
import { FoodOrder } from "../classes/product";
export class FoodOrderPool extends ObjectPool<FoodOrder> {
    constructor() {
        super();
    }

    createNewItem() {
        return new FoodOrder();
    }
}
