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
    private _id: number;
    private _isLoggedIn: boolean;
    private _loginMethod: number;
    private _firstName: string;
    private _lastName: string;
    private _facebookId: string;
    private _googleId: string;
    private _email: string;
    private _phone: string;
    private _address: string;
    private _province: Province;

    constructor(id: number, firstName: string, lastName: string, isLoggedIn?: boolean,
        loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._isLoggedIn = (isLoggedIn ? isLoggedIn : false);
        this._loginMethod = (loginMethod ? loginMethod : 0);
        this._email = (email ? email : "");
        this._phone = (phone ? phone : "");
        this._address = (address ? address : "");
        this._province = (province ? province : new Province(0, ""));
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public set isLoggedIn(value: boolean) {
        this._isLoggedIn = value;
    }

    public get loginMethod(): number {
        return this._loginMethod;
    }

    public set loginMethod(value: number) {
        this._loginMethod = value;
    }

    public get facebookId(): string {
        return this._facebookId;
    }

    public set facebookId(value: string) {
        this._facebookId = value;
    }

    public get googleId(): string {
        return this._googleId;
    }

    public set googleId(value: string) {
        this._googleId = value;
    }


    public get firstName(): string {
        return this._firstName;
    }

    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(value: string) {
        this._lastName = value;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        this._email = value;
    }

    public get phone(): string {
        return this._phone;
    }

    public set phone(value: string) {
        this._phone = value;
    }

    public get address(): string {
        return this._address;
    }

    public set address(value: string) {
        this._address = value;
    }

    public get province(): Province {
        return this._province;
    }

    public set province(value: Province) {
        this._province = value;
    }

    public login(facebookId?: string, googleId?: string) {
        this._isLoggedIn = true;
        if (this.facebookId) {
            this.facebookId = facebookId;
            this.loginMethod = UserContant.LOGIN_METHOD.FACEBOOK;
        }
        if (this.googleId) {
            this.googleId = googleId;
            this.loginMethod = UserContant.LOGIN_METHOD.GOOGLE;
        }
    }

    public reset() {
        this._address = "";
        this._email = "";
        this._facebookId = "";
        this._firstName = "";
        this._googleId = "";
        this._id = 0;
        this._isLoggedIn = false;
        this._lastName = "";
        this._loginMethod = 0;
        this._phone = "";
        this._province = new Province(0, "");
    }
}

export class Staff extends User {
    private _role: number;
    private _staffId: number;
    private _restId: number;
    private _vendorId: number;
    private _userName: string;
    private _password: string;


    constructor(id: number, firstName: string, lastName: string, role?: number, staffId?: number, restId?: number, vendorId?: number,
        isLoggedIn?: boolean, loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        super(id, firstName, lastName, isLoggedIn, loginMethod, email, phone, address, province);
        this._role = (role ? role : 0);
        this._staffId = (staffId ? staffId : 0)
        this._restId = (restId ? restId : 0)
        this._vendorId = (vendorId ? vendorId : 0)
    }

    login(userName: string, password: string) {
        this.isLoggedIn = true;
        this._userName = userName;
        this._password = password;
        this.loginMethod = UserContant.LOGIN_METHOD.ACCOUNT;
    }
}

export class Manager extends Staff {
    constructor(id: number, firstName: string, lastName: string, role?: number, staffId?: number, restId?: number, vendorId?: number,
        isLoggedIn?: boolean, loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        super(id, firstName, lastName, role, staffId, restId, vendorId, isLoggedIn, loginMethod, email, phone, address, province);
    }
}

export class Waiter extends Staff {
    constructor(id: number, firstName: string, lastName: string, role?: number, staffId?: number, restId?: number, vendorId?: number,
        isLoggedIn?: boolean, loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        super(id, firstName, lastName, role, staffId, restId, vendorId, isLoggedIn, loginMethod, email, phone, address, province);
    }
}
export class Chef extends Staff {
    constructor(id: number, firstName: string, lastName: string, role?: number, staffId?: number, restId?: number, vendorId?: number,
        isLoggedIn?: boolean, loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        super(id, firstName, lastName, role, staffId, restId, vendorId, isLoggedIn, loginMethod, email, phone, address, province);
    }
}
export class Bartender extends Staff {
    constructor(id: number, firstName: string, lastName: string, role?: number, staffId?: number, restId?: number, vendorId?: number,
        isLoggedIn?: boolean, loginMethod?: number, email?: string, phone?: string, address?: string, province?: Province) {
        super(id, firstName, lastName, role, staffId, restId, vendorId, isLoggedIn, loginMethod, email, phone, address, province);
    }
}