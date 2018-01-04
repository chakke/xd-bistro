import { Map } from "../classes/map";


export class MapPool {
    constructor() {
    }

    getItem(): Map {
        return new Map("0", "0", "", []);
    }

    getItemWithData(data: any) {
        let map = this.getItem();
        if (data.hasOwnProperty("id")) map.id = data.id;
        if (data.hasOwnProperty("floorId")) map.floorId = data.floorId;
        if (data.hasOwnProperty("title")) map.title = data.title;
        if (data.hasOwnProperty("currentHeight")) map.currentHeight = data.currentHeight;
        if (data.hasOwnProperty("currentWidth")) map.currentWidth = data.currentWidth;
        if (data.hasOwnProperty("numberOfElement")) map.numberOfElement = data.numberOfElement;
        if (data.hasOwnProperty("components")) map.components = data.components;
        return map;
    }
}