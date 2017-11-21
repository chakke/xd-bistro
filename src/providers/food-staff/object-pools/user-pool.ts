import { ObjectPool } from "./object-pool";
import { User } from "../classes/user";
export class UserPool extends ObjectPool<User> {
    constructor() {
        super();
    }

    createNewItem(): User {
        return new User(0, "", "");
    }
}