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
        if (data.hasOwnProperty("birthday")) user.birthDay = data.birthday;
        if (data.hasOwnProperty("email")) user.email = data.email;
        if (data.hasOwnProperty("firebase_id")) user.firebaseId = data.firebase_id;
        if (data.hasOwnProperty("firebase_reference")) user.firebaseReference = data.firebase_reference;
        if (data.hasOwnProperty("id")) user.id = data.id;
        if (data.hasOwnProperty("indentify")) user.indentify = data.indentify;
        if (data.hasOwnProperty("name")) user.name = data.name;
        if (data.hasOwnProperty("password")) user.password = data.password;
        if (data.hasOwnProperty("phone")) user.phone = data.phone;
        if (data.hasOwnProperty("staff_role")) user.staffRole = data.staff_role;
        if (data.hasOwnProperty("staff_type")) user.staffType = data.staff_type;
        if (data.hasOwnProperty("username")) user.userName = data.username;          
        return user;
    } 
}