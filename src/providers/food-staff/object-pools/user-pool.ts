import { ObjectPool } from "./object-pool";
import { User } from "../classes/user";
import { UserFactory } from "../factories/user-factory";

export class UserPool {
    userFactory = new UserFactory();
    constructor() {
    }

    getItem(type: number): User {
        return this.userFactory.getUser(type);
    }

    getItemWithData(data: any) {
        let user = this.getItem(data.type);
        if (data.hasOwnProperty("id")) user.id = data.id;
        if (data.hasOwnProperty("type")) user.type = data.type;
        if (data.hasOwnProperty("isLoggedIn")) user.isLoggedIn = data.isLoggedIn;
        if (data.hasOwnProperty("loginMethod")) user.loginMethod = data.loginMethod;
        if (data.hasOwnProperty("firstName")) user.firstName = data.firstName;
        if (data.hasOwnProperty("lastName")) user.lastName = data.lastName;
        if (data.hasOwnProperty("facebookId")) user.facebookId = data.facebookId;
        if (data.hasOwnProperty("googleId")) user.googleId = data.googleId;
        if (data.hasOwnProperty("email")) user.email = data.email;
        if (data.hasOwnProperty("phone")) user.phone = data.phone;
        if (data.hasOwnProperty("province")) user.province = data.province;
        if (data.hasOwnProperty("role")) user["role"] = data.role;
        if (data.hasOwnProperty("staffId")) user["staffId"] = data.staffId;
        if (data.hasOwnProperty("restId")) user["restId"] = data.restId;
        if (data.hasOwnProperty("vendorId")) user["vendorId"] = data.vendorId;
        if (data.hasOwnProperty("userName")) user["userName"] = data.userName;
        if (data.hasOwnProperty("password")) user["password"] = data.password;
        return user;
    } 
}