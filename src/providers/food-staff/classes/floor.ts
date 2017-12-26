import { Map } from "./map";
export class Floor {
    id: string;
    name: string;
    capacity: number;
    maps: Array<Map> = [];
    constructor() {
    }

    reset() {
        this.id = "0";
        this.name = "";
        this.maps = [];
    }

    mappingFirebaseData(data) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.capacity = data.capacity;
            // this.maps = data.maps;
        }
    }
}