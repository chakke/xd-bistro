import { ObjectPool } from "./object-pool";
import { Product } from "../classes/product";

export class ProductPool extends ObjectPool<Product>{
    constructor() {
        super();
    }

    createNewItem() {
        return new Product();
    }     
}
