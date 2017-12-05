// Class Table là 1 bàn tại nhà hàng
// Class TableInOrder là 1 bàn cùng với thông tin đặt chỗ

import { Order } from "./order";
import { OrderInTable } from "../interfaces/order-in-table";

export class Table {
    private _id: string;
    private _name: string;
    private _type: number;
    private _maxPerson: number;

    constructor() {
        this.reset();
    }

    public reset() {
        this._id = "0";
        this._name = "name";
        this._type = 0;
        this._maxPerson = 0;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get type(): number {
        return this._type;
    }

    public set type(value: number) {
        this._type = value;
    }

    public get maxPerson(): number {
        return this._maxPerson;
    }

    public set maxPerson(value: number) {
        this._maxPerson = value;
    }
}

export class TableInOrder extends Table {
    private _currentPerson: number;
    private _status: number;
    private _orders: Array<OrderInTable>;
    private _staffs: Array<number>;


    constructor() {
        super();
    }

    public reset() {
        super.reset();
        this._currentPerson = 0;
        this._status = 0;
        this._orders = [];
    }

    public get currentPerson(): number {
        return this._currentPerson;
    }

    public set currentPerson(value: number) {
        this._currentPerson = value;
    }

    public get status(): number {
        return this._status;
    }

    public set status(value: number) {
        this._status = value;
    }

    public get orders(): Array<OrderInTable> {
        return this._orders;
    }

    public set orders(value: Array<OrderInTable>) {
        this._orders = value;
    }

    public get staffs(): Array<number> {
        return this._staffs;
    }

    public set staffs(value: Array<number>) {
        this._staffs = value;
    }



}