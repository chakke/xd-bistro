import { IComponentType } from "./interfaces/i-component-type";

/**
 * Quy định chung cho các class:
 * - Mỗi class có 1 id riêng. Id này sẽ được truyền vào trong construtor. 
 *   Object pool sẽ chịu trách nhiệm tính ID này.
 * - Tất cả class sẽ dùng name thay cho title
 * - Tất cả class sẽ dùng biến private và có get set
 * 
 * Quy định chung cho các Object pool
 * - Mỗi Object pool sẽ là 1 pool lưu trữ các object của class tương ứng.
 * - Object pool sẽ chịu trách nhiệm quyết định lấy object ngay tại local varible hoặc request lên server
 * - Object pool phải kiểm tra tính update của dữ liệu
 */

export class UserContant {
    public static LOGIN_METHOD = {
        FACEBOOK: 1,
        GOOGLE: 2,
        ACCOUNT: 3
    }
    public static USER_TYPE = {
        USER: 1,
        STAFF: 2,
        MANAGER: 3,
        BARTENDER: 4,
        CHEF: 5,
        WAITER: 6
    }
    public static AVATAR_IMAGE = "https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png";
}

export class AssetsUrl {
    public static BASE_URL: string = "assets/food-staff";
}

export class FakeApiUrl {
    public static MENU: string = "/data/menu.json";
    public static TABLE_IN_ORDER = "/data/table-in-order.json";
    public static CURRENT_ORDER  = "/data/order.json";
    public static MAP = "/data/map.json";
}

export class ResponseCode {
    public static ERROR_CODE: number = 0;
    public static SUCCESS_CODE: number = 1;
}

export const TABLE_STATUS = {
    ALL: {
        id: 0,
        name: "Tất cả"
    },
    IN_USE: {
        id: 1,
        name: "Đang phục vụ",
        shortName: "Đang PV"
    },
    ORDERED: {
        id: 2,
        name: "Đã đặt"
    },
    EMPTY: {
        id: 3,
        name: "Còn trống"
    },
}

export const ORDER_STATUS = {
    UN_CONFIRM: {
        id: 0,
        name: "Chưa xác nhận"
    },
    IN_USE: {
        id: 1,
        name: "Đang sử dụng"
    },
    PENDING: {
        id: 2,
        name: "Chờ thanh toán"
    },
    PAYED: {
        id: 3,
        name: "Đã thanh toán"
    },
    CANCELED: {
        id: 4,
        name: "Hủy"
    }
} 

export class ComponentType {
    public static UI_COMPONENT: IComponentType = {
        type: "component",
        name: "Phần tử"
    }
    public static AREA: IComponentType = {
        type: "area",
        name: "Khu vực"
    }
    public static TABLE: IComponentType = {
        type: "table",
        name: "Bàn"
    }
    public static DOOR: IComponentType = {
        type: "door",
        name: "Cửa"
    }
    public static WC: IComponentType = {
        type: "wc",
        name: "Nhà vệ sinh"
    }
    public static KITCHEN: IComponentType = {
        type: "kitchen",
        name: "Bếp"
    }
    public static BAR: IComponentType = {
        type: "bar",
        name: "Quầy bar"
    }
    public static RECEPTIONIST: IComponentType = {
        type: "receptionist",
        name: "Thu ngân"
    }
    public static STAIR: IComponentType = {
        type: "stair",
        name: "Cầu thang"
    }
    public static RESTRICT: IComponentType = {
        type: "restrict",
        name: "Khu vực cấm"
    }
}

export const MAP_RATIO = 1.55;
