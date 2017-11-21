
/**
 * Class Product là sản phẩm của nhà hàng
 * Thức ăn: Food được Nhân viên bàn và phụ bếp quản lý
 * Đồ uống: Drink được Bartender quản lý *
 */

 export class Product{
     private _id: number;
     private _name: string;
     private _price: number;
     private _image: string;
     private _description: string;
     private _unit: string;
     private _waittingTime: number;
     private _keyword: string;
 
	constructor(id: number, name: string, price: number, image: string, description: string, unit: string, waittingTime: number, keyword: string) {
		this._id = id;
		this._name = name;
		this._price = price;
		this._image = image;
		this._description = description;
		this._unit = unit;
		this._waittingTime = waittingTime;
		this._keyword = keyword;
	}
     
	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get price(): number {
		return this._price;
	}

	public set price(value: number) {
		this._price = value;
	}

	public get image(): string {
		return this._image;
	}

	public set image(value: string) {
		this._image = value;
	}

	public get description(): string {
		return this._description;
	}

	public set description(value: string) {
		this._description = value;
	}

	public get unit(): string {
		return this._unit;
	}

	public set unit(value: string) {
		this._unit = value;
	}

	public get waittingTime(): number {
		return this._waittingTime;
	}

	public set waittingTime(value: number) {
		this._waittingTime = value;
	}

	public get keyword(): string {
		return this._keyword;
	}

	public set keyword(value: string) {
		this._keyword = value;
	}
 }

 export class Food{

 }