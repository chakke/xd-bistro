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
	tableIds: Array<string>;
	/**Name bàn của order */
	tables: Array<Table>;

	/**ID nhân viên ghi order */
	staffId: string;
	/**Tên nhân viên ghi order */
	staffName: string;
	/**Ảnh đại diện của nhân viên ghi order */
	staffAvatar: string;
	// Ghi chú
	note: string;
	/**Số lượng khách trong order này, nếu order có nhiều bàn, thì là tổng khách trên các bàn */
	numberCustormer: number;
	/** Tên khách hàng*/
	custormerName: string;
	/** Số điện thoại của khách hàng */
	custormerPhone: string;
	/** ID của khách hàng, nếu đã tồn tại trên hệ thống */
	custormerId: string;

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
		this.tableIds = [];
		this.tables = [];
		this.timeCreate = new Date();
		this.type = 0;
		this.note = "";
		this.numberCustormer = 0;
		this.custormerName = "";
		this.custormerPhone = "";
		this.custormerId = "";
	}

	mappingFirebaseData(data) {
		if (data) {
			this.areaId = data.area_id;
			this.descrition = data.area_description;
			this.id = data.id;
			this.staffId = data.staff_id;
			this.state = data.state;
			this.tableIds = data.table_ids;
			this.timeCreate = data.time_create;
			this.type = data.type;
			this.note = data.note;
			this.numberCustormer = data.number_customers;
			this.custormerId = data.customer_id;
			this.custormerName = data.customer_name;
			this.custormerPhone = data.customer_phone;
		}
	}




}

