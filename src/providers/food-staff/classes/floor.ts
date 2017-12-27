import { Map } from "./map";
export class Floor {
    id: string;
    name: string;
    capacity: number;
    maps: Array<Map> = [];
    firebaseId: string;
    constructor() {
    }

    reset() {
        this.id = "0";
        this.name = "";
        this.maps = [];
        this.firebaseId = "";
    }

    mappingFirebaseData(data) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.capacity = data.capacity;
            this.firebaseId = data.firebase_id;
            // this.maps = data.maps;
        }
    }
}