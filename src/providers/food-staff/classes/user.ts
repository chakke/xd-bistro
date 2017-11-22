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
    private _type: number;
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
    private _avatarImg: string;

    constructor() {
        this.reset();
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get type(): number {
        return this._type;
    }

    public set type(value: number) {
        this._type = value;
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

    public get avatarImg(): string {
        return this._avatarImg;
    }

    public set avatarImg(value: string) {
        this._avatarImg = value;
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
        this.type = UserContant.USER_TYPE.USER;
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
        this._avatarImg = UserContant.AVATAR_IMAGE;
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


    login(userName: string, password: string) {
        this.isLoggedIn = true;
        this._userName = userName;
        this._password = password;
        this.loginMethod = UserContant.LOGIN_METHOD.ACCOUNT;
    }

    reset() {
        super.reset();
        this.role = 0;
        this.staffId = 0;
        this.restId = 0;
        this.vendorId = 0;
        this.userName = "";
        this.password = "";
        this.type = UserContant.USER_TYPE.STAFF;
    }
}

export class Manager extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
        this.type = UserContant.USER_TYPE.MANAGER;
    }
}

export class Waiter extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
        this.type = UserContant.USER_TYPE.WAITER;
    }
}
export class Chef extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
        this.type = UserContant.USER_TYPE.CHEF;
    }
}
export class Bartender extends Staff {
    constructor() {
        super();
    }
    reset() {
        super.reset();
        this.type = UserContant.USER_TYPE.BARTENDER;
    }
}