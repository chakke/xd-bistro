import { FoodInOrder } from "../interfaces/food-in-order";
import { Table } from "./table";

export class Order {
    private _id: string;
    private _code: string;
    private _ownerId: string;
    private _status: number; 
    private _foods: Array<FoodInOrder>;
    private _tableIds: Array<string>;

    constructor() {

    }

    reset() {
        this._id = "0";
        this._code = "#";
        this._ownerId = "0";
        this._status = 0;
        this._foods = [];
        this._tableIds = [];
    }


	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get code(): string {
		return this._code;
	}

	public set code(value: string) {
		this._code = value;
	}

	public get ownerId(): string {
		return this._ownerId;
	}

	public set ownerId(value: string) {
		this._ownerId = value;
	}

	public get status(): number {
		return this._status;
	}

	public set status(value: number) {
		this._status = value;
	}

	public get foods(): Array<FoodInOrder> {
		return this._foods;
	}

	public set foods(value: Array<FoodInOrder>) {
		this._foods = value;
	}

	public get tableIds(): Array<string> {
		return this._tableIds;
	}

	public set tableIds(value: Array<string>) {
		this._tableIds = value;
	}
    
}

