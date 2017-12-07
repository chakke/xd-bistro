import { FoodInOrder } from "../interfaces/food-in-order";
import { Table, TableInOrder } from "./table";
import { Staff } from "./user";
import { StaffInOrder } from "../interfaces/staff-in-order";

export class Order {
	private _id: string;
	private _code: string;
	private _ownerId: string;
	private _status: number;
	private _foods: Array<FoodInOrder>;
	private _tableIds: Array<string>;
	private _staffs: Array<StaffInOrder>;
	private _time: Date;

	constructor() {
		this.reset();
	}

	reset() {
		this._id = "0";
		this._code = "#";
		this._ownerId = "0";
		this._status = 0;
		this._foods = [];
		this._tableIds = [];
		this._staffs = [];
		this._time = new Date();
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

	public get staffs(): Array<StaffInOrder> {
		return this._staffs;
	}

	public set staffs(value: Array<StaffInOrder>) {
		this._staffs = value;
	}


	public get time(): Date {
		return this._time;
	}

	public set time(value: Date) {
		this._time = value;
	}

}

