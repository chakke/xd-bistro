export interface ResetableObject {
    reset();
}

export abstract class ObjectPool<T extends ResetableObject>{
    pool: Array<T>;
    constructor() {
        this.pool = [];
    }

    initialize(length: number) {
        while (this.pool.length < length) {
            this.pool.push(this.createNewItem());
        }
    };
  
    abstract createNewItem(): T;

    getItem(): T {
        if (this.pool.length == 0) {
            return this.createNewItem();
        }
        else return this.pool.pop();
    }

    freeItem(item: T) {
        item.reset();
        this.pool.push(item);
    }

}