/**
 * Class User là 1 đối tượng khi đăng nhập vào hệ thống
 * 1 User có thể là Khách hàng, quản lý, nhân viên bàn, nhân viên bar, nhân viên bếp
 * Khách hàng: User
 * - Đăng nhập bằng facebook hoặc google
 * Nhân viên, quản lý: Staff
 * - Đăng nhập bằng tài khoản và mật khẩu
 */

import { Province } from "./province";
import { UserContant } from "../app-constant";


export class User {
    birthDay: Date;
    email: string;
    firebaseId: string;
    firebaseReference: string;
    id: string;
    indentify: string;
    name: string;
    password: string;
    phone: string;
    staffRole: number;
    staffType: number;
    userName: string;
    avatar: string;

    constructor() {
        this.reset();
    }

    public reset() {
        this.birthDay = new Date();
        this.email = "";
        this.firebaseId = "";
        this.firebaseReference = "";
        this.id = "";
        this.indentify = "";
        this.name = "";
        this.password = "";
        this.phone = "";
        this.staffRole = 0;
        this.staffType = 0;
        this.userName = "";
        this.avatar = "";
    }

    mappingFirebaseData(data) {
        if (data) {
            if (data.hasOwnProperty("birthday")) this.birthDay = data.birthday;
            if (data.hasOwnProperty("email")) this.email = data.email;
            if (data.hasOwnProperty("firebase_id")) this.firebaseId = data.firebase_id;
            if (data.hasOwnProperty("firebase_reference")) this.firebaseReference = data.firebase_reference;
            if (data.hasOwnProperty("id")) this.id = data.id;
            if (data.hasOwnProperty("indentify")) this.indentify = data.indentify;
            if (data.hasOwnProperty("name")) this.name = data.name;
            if (data.hasOwnProperty("password")) this.password = data.password;
            if (data.hasOwnProperty("phone")) this.phone = data.phone;
            if (data.hasOwnProperty("staff_role")) this.staffRole = data.staff_role;
            if (data.hasOwnProperty("staff_type")) this.staffType = data.staff_type;
            if (data.hasOwnProperty("username")) this.userName = data.username;
        }
    }
}

export class Staff extends User {
    private _role: number;
    private _staffId: number;
    private _restId: number;
    private _vendorId: number;
    private _userName: string;
    private _password: string;


    constructor() {
        super();
    }

    public get role(): number {
        return this._role;
    }

    public set role(value: number) {
        this._role = value;
    }

    public get staffId(): number {
        return this._staffId;
    }

    public set staffId(value: number) {
        this._staffId = value;
    }

    public get restId(): number {
        return this._restId;
    }

    public set restId(value: number) {
        this._restId = value;
    }

    public get vendorId(): number {
        return this._vendorId;
    }

    public set vendorId(value: number) {
        this._vendorId = value;
    }

    public get userName(): string {
        return this._userName;
    }

    public set userName(value: string) {
        this._userName = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
    }

    reset() {
        super.reset();
        this.role = 0;
        this.staffId = 0;
        this.restId = 0;
        this.vendorId = 0;
        this.userName = "";
        this.password = "";
    }
}

export class Manager extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
    }
}

export class Waiter extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
    }
}
export class Chef extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
    }
}
export class Bartender extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
    }
}