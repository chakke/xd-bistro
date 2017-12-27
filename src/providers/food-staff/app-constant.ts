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

export const SEPARATOR = "(づ￣ ³￣)づ";

export class UserContant {
    public static LOGIN_METHOD = {
        FACEBOOK: 1,
        GOOGLE: 2,
        ACCOUNT: 3
    }
    public static USER_TYPE = {
        CHEF: 1,
        BAR: 1,
        WAITER: 2,
        ORDER: 3,
        RECEPTIONIST: 4,
        MANAGER: 5,
        SUPERVISOR: 6,
        SECURITY: 7
    }

    public static STAFF_STATE = {
        ACTIVE: 0,
        UNACTIVE: 1,
        BLOCKED: 2
    }

    public static STAFF_TYPE = {
        PARTIME: 0,
        FULLTIME: 1,
        ONETIME: 2
    }

    public static AVATAR_IMAGE = "https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png";
}

export class AssetsUrl {
    public static BASE_URL: string = "assets/food-staff";
}

export class FakeApiUrl {
    public static MENU: string = "/data/menu.json";
    public static TABLE_IN_ORDER = "/data/table-in-order.json";
    public static CURRENT_ORDER = "/data/order.json";
    public static MAP = "/data/map.json";
}

export class ResponseCode {
    public static ERROR_CODE: number = 0;
    public static SUCCESS_CODE: number = 1;
}

export const TABLE_STATUS = {
    ALL: {
        id: -1,
        name: "Tất cả"
    },
    IN_USE: {
        id: 2,
        name: "Đang phục vụ",
        shortName: "Đang PV"
    },
    BOOKED: {
        id: 1,
        name: "Đã đặt"
    },
    EMPTY: {
        id: 0,
        name: "Còn trống"
    },
}

export const TABLE_TYPE = {
    NORMAL: {
        id: 1,
        name: "Thường"
    },
    VIP: {
        id: 2,
        name: "VIP"
    }
}


// export const ORDER_STATUS = {
//     UN_CONFIRM: {
//         id: 0,
//         name: "Chưa xác nhận"
//     },
//     IN_USE: {
//         id: 1,
//         name: "Đang sử dụng"
//     },
//     PENDING: {
//         id: 2,
//         name: "Chờ thanh toán"
//     },
//     PAYED: {
//         id: 3,
//         name: "Đã thanh toán"
//     },
//     CANCELED: {
//         id: 4,
//         name: "Hủy"
//     }
// }

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

export const FIREBASE_PATH = {
    PRODUCT: "products",
    FOOD: "foods",
    FOOD_CATEGORY: "food_categories",
    FOOD_OPTION: "food_options",
    FOOD_SALE: "food_sales",
    FOOD_SIZE: "food_sizes",
    FOOD_STATE: "food_states",
    FOOD_TYPE: "food_types",
    FOOD_UNIT: "food_units",
    RESTAURANT: "restaurants",
    TABLE: "tables",
    STAFF: "staffs",
    ORDER: "orders",
    AREA: "areas",
    FOOD_ORDER: "foodorders"
}

export const FIREBASE_CONST = {
    DOCUMENT_CHANGE_TYPE: {
        ADD: "added",
        MODIFY: "modified",
        REMOVE: "removed"
    }
}

export const FOOD_STATE = {
    NOT_YET: {
        id: 0,
        value: "Chưa kinh doanh"
    },
    AVAILABLE: {
        id: 1,
        value: "Sẵn sàng phục vụ"
    },
    OUT_OF_STOCK: {
        id: 2,
        value: "Hết hàng"
    },
    OUT_OF_BUSINESS: {
        id: 3,
        value: "Ngừng kinh doanh"
    }
}

export const FOOD_ORDER_STATE = {
    /**Mặc định khi order food thì món ăn ở trạng thái đợi */
    WAITING: 0,
    /**Sau khi đầu bếp xem xét các món đang đợi, lựa chọn món để chế biến, đưa nó vào trạng thái Cooking */
    COOKING: 1,
    /**Nếu hết nguyên liệu, hoặc không thể chế biến tại thời điểm hiện tại thì thông báo */
    COOKING_UNAVAILABLE: 2,
    /**Khi chế biến xong, chuyển nó về trạng thái sẵn sàng để giao, chạy bàn tiếp nhận thông tin và chuyển đến bàn theo yêu cầu */
    DELIVERABLE: 3,
    /**Khi phục vụ giao xong món ăn */
    DELIVERED: 4,
    /**Trong quá trình giao, khách không nhận hoặc hủy món */
    RETURNED: 5
}

export const PAYMENT_STATE = {
    /**Đã thanh toán */
    PAID: 0,
    /**Đã hủy, vì một lý do nào đó,thông tin thanh toán không hợp lệ, nên hủy hóa đơn */
    CANCELLED: 1
}

export const PAYMENT_TYPE = {
    /**Ghi nợ, chưa trả */
    BOOKED: -1,
    /**Cash : tiền mặt */
    CASH: 0,
    /**Thẻ visa or master hoặc atm */
    BANK: 1
}

export const ORDER_STATE = {
    /**Đã tạo, chưa gọi món hoặc đã gọi món nhưng chưa chế biến xong */
    CREATED: 0,
    /**Đã chuyển xong các món */
    FOOD_DONE: 1,
    /**Đã thanh toán */
    PAID: 2,
    /**Đã hủy */
    CANCELLED: 3
}