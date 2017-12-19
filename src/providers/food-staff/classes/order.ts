import { FoodInOrder } from "../interfaces/food-in-order";
import { Table, TableInOrder } from "./table";
import { Staff } from "./user";
import { StaffInOrder } from "../interfaces/staff-in-order";

export class Order {
	/**ID của Order */
	id: string;
	/**Mô tả của order */
	descrition: string;
	/**Trạng thái order */
	state: number;
	/**Loại order */
	type: number;
	/**Thời gian tạo order */
	timeCreate: Date;

	/**ID của khu vực */
	areaId: string;
	/**Tên khu vực */
	areaName: string;
	/**ID Bàn của order */
	tableId: string;
	/**Name bàn của order */
	tableName: string;



	/**ID nhân viên ghi order */
	staffId: string;
	/**Tên nhân viên ghi order */
	staffName: string;
	/**Ảnh đại diện của nhân viên ghi order */
	staffAvatar: string;

	constructor() {
		this.reset();
	}

	reset() {
		this.areaId = "";
		this.areaName = "";
		this.descrition = "";
		this.id = "";
		this.staffAvatar = "";
		this.staffId = "";
		this.staffName = "";
		this.state = 0;
		this.tableId = "";
		this.tableName = "";
		this.timeCreate = new Date();
		this.type = 0;
	}




}

