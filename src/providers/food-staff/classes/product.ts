import { SEPARATOR } from "../app-constant";
import { Utils } from "../../app-utils";

/**
 * Class Product là sản phẩm của nhà hàng
 * Thức ăn: Food được Nhân viên bàn và phụ bếp quản lý
 * Đồ uống: Drink được Bartender quản lý *
 */

export class Product {
	private _firebaseId: string;
	private _id: string;
	private _album: string;
	private _category: string;
	private _code: string;
	private _currency: string;
	private _description: string;
	private _enName: string;
	private _image: string;
	private _name: string;
	private _options: Array<any>;
	private _paper: string;
	private _price: number;
	private _sales: Array<any>;
	private _size: string;
	private _state: string;
	private _type: string;
	private _unit: string;
	private _keyword: string;

	// constructor(id: number, name: string, price: number, image: string, description: string, unit: string, waittingTime: number, keyword: string) {
	// 	this._id = id;
	// 	this._name = name;
	// 	this._price = price;
	// 	this._image = image;
	// 	this._description = description;
	// 	this._unit = unit;
	// 	this._waittingTime = waittingTime;
	// 	this._keyword = keyword;
	// }

	constructor() {
		this.reset();
	}

	reset() {
		this._firebaseId = "";
		this._album = "";
		this._category = "";
		this._code = "";
		this._currency = "";
		this._description = "";
		this._enName = "";
		this._id = "";
		this._image = "";
		this._keyword = "";
		this._name = "";
		this._options = [];
		this._paper = "";
		this._price = 0;
		this._sales = [];
		this._size = "";
		this._state = "";
		this._type = "";
		this._unit = "";
	}

	mappingFirebaseData(data) {
		if (data) {
			this._firebaseId = data.firebase_id;
			this._album = data.album_id + "";
			this._category = data.category + "";
			this._code = data.code + "";
			this._currency = data.currency + "";
			this._description = data.description + "";
			this._enName = data.en_name + "";
			this._id = data.id + "";
			this._image = data.image + "";
			this._name = data.name + "";
			this._options = data.options;
			this._paper = data.paper + "";
			this._price = data.price;
			this._sales = data.sales;
			this._size = data.size + "";
			this._state = data.state + "";
			this._type = data.type + "";
			this._unit = data.unit + "";
			if (this._name) {
				this._keyword = this.name.toLowerCase();
				this._keyword += SEPARATOR + Utils.bodauTiengViet(this.name.toLowerCase());
				let shortTitle = this.name.toLowerCase().split(' ').map(elm => { return elm.charAt(0) }).join('');
				this._keyword += SEPARATOR + shortTitle;
			}
			if (this._enName)
				this._keyword += SEPARATOR + this.enName.toLowerCase();
			if (this._code)
				this._keyword += SEPARATOR + this.code.toLowerCase();
		}
	}

	public get firebaseId(): string {
		return this._firebaseId;
	}

	public set firebaseId(value: string) {
		this._firebaseId = value;
	}


	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get album(): string {
		return this._album;
	}

	public set album(value: string) {
		this._album = value;
	}

	public get category(): string {
		return this._category;
	}

	public set category(value: string) {
		this._category = value;
	}

	public get code(): string {
		return this._code;
	}

	public set code(value: string) {
		this._code = value;
	}

	public get currency(): string {
		return this._currency;
	}

	public set currency(value: string) {
		this._currency = value;
	}

	public get description(): string {
		return this._description;
	}

	public set description(value: string) {
		this._description = value;
	}

	public get enName(): string {
		return this._enName;
	}

	public set enName(value: string) {
		this._enName = value;
	}

	public get image(): string {
		return this._image;
	}

	public set image(value: string) {
		this._image = value;
	}

	public get options(): Array<any> {
		return this._options;
	}

	public set options(value: Array<any>) {
		this._options = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get paper(): string {
		return this._paper;
	}

	public set paper(value: string) {
		this._paper = value;
	}

	public get price(): number {
		return this._price;
	}

	public set price(value: number) {
		this._price = value;
	}

	public get sales(): Array<any> {
		return this._sales;
	}

	public set sales(value: Array<any>) {
		this._sales = value;
	}

	public get size(): string {
		return this._size;
	}

	public set size(value: string) {
		this._size = value;
	}

	public get state(): string {
		return this._state;
	}

	public set state(value: string) {
		this._state = value;
	}

	public get type(): string {
		return this._type;
	}

	public set type(value: string) {
		this._type = value;
	}

	public get unit(): string {
		return this._unit;
	}

	public set unit(value: string) {
		this._unit = value;
	}

	public get keyword(): string {
		return this._keyword;
	}

	public set keyword(value: string) {
		this._keyword = value;
	}
}

export class FoodOrder {
	//path tren firebase
	firebaseId: string;
	/**ID của food order */
	id: string;
	/**ID cuar order */
	orderId: string;
	/**Nhân viên gọi món */
	staffId: string;
	/**Trạng thái của food trong order , xem thêm FoodOrderState*/
	state: number;
	/**Số lượng order */
	amountOrder: number;
	/**Số lượng đã chế biến xong */
	amountDone: number;
	/**Số lượng đã trả cho khách */
	amountReturn: number;
	/**Số lượng đang chế biến */
	amountProcessing: number;
	/**Số lượng đợi chế biến */
	//amountOrder - amountDone - amountReturn - amountProcessing
	/**Thời gian gọi món */
	timeCreate: Date;
	/** Id món ăn */
	foodId: string;
	/**Món ăn */
	food: Product;
	/**Tổng tiền toàn bộ của món ăn = amout * food-saled-price */
	price: number;
	/**Tổng toàn bộ chiết khấu trên món ăn đó */
	sale: number;
	/**Danh sách id của các options */
	options: Array<string>;
	/**Ghi chú */
	note: string;

	constructor() {
		this.reset();
	}

	reset() {
		this.firebaseId = "";
		this.id = "";
		this.orderId = "";
		this.staffId = "";
		this.state = 0;
		this.amountOrder = 0;
		this.amountDone = 0;
		this.amountReturn = 0;
		this.amountProcessing = 0;
		this.food = null;
		this.foodId = "";
		this.price = 0;
		this.sale = 0;
		this.options = [];
		this.note = "";
		this.timeCreate = new Date();
	}

	mappingFirebaseData(data) {
		if (data) {
			this.firebaseId = data.firebase_id;
			this.id = data.id;
			this.orderId = data.order_id;
			this.staffId = data.staff_id;
			this.state = data.state;
			this.amountOrder = data.amount_order;
			this.amountDone = data.amount_done;
			this.amountReturn = data.amount_return;
			this.amountProcessing = data.amount_processing;
			this.foodId = data.food_id;
			this.food = null;
			this.price = data.price;
			this.sale = data.sale;
			this.options = data.options;
			this.note = data.note;
			this.timeCreate = data.time_create;
		}
	}
}
