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
}

export class ResponseCode {
    public static ERROR_CODE: number = 0;
    public static SUCCESS_CODE: number = 1;
}
