import { User, Bartender, Chef, Manager, Staff, Waiter } from "../classes/user";
import { Province } from "../classes/province";
import { UserContant } from "../app-constant";

export class UserFactory {
    constructor() {
    }
    getUser(type: number):User {
        switch (type) {
            case UserContant.USER_TYPE.BARTENDER: return new Bartender();
            case UserContant.USER_TYPE.CHEF: return new Chef();
            case UserContant.USER_TYPE.MANAGER: return new Manager();
            case UserContant.USER_TYPE.STAFF: return new Staff();
            case UserContant.USER_TYPE.WAITER: return new Waiter();
            default: return new User();
        }
    }
}