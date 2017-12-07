import { Utils } from "../../app-utils";
import { AlertController } from 'ionic-angular';
import { IComponentType } from '../interfaces/i-component-type';
import { ComponentType } from '../app-constant';


export class UIComponent {
    id: number;
    title: string;
    type: IComponentType;
    classList: Array<string> = [];
    innerHtml: string;
    width: number;
    height: number;
    x: number;
    y: number;
    zIndex = 10;
    rotate: number = 0;
    icon: string;
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        this.id = id;
        this.type = ComponentType.UI_COMPONENT;
        this.classList.push("map-symbol");
        this.innerHtml = "";
        this.title = title ? title : "";
        this.x = (x ? x : 0);
        this.y = (y ? y : 0);
        this.width = (width ? width : 50);
        this.height = (height ? height : 50);
        this.zIndex = (zIndex ? zIndex : 10);
        this.rotate = (rotate ? rotate : 0);
    }

    doRotate() {
        this.rotate += 90;
        this.rotate = this.rotate % 360;
    }

    upIndex() {
        this.zIndex++;
    }

    downIndex() {
        this.zIndex--;
    }

    getIcon(option?: any) {
        return this.icon;
    }

}

export class Area extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-area");
        this.type = ComponentType.AREA;
        if (!width)
            this.width = 100;
        if (!height)
            this.height = 100;
        if (!zIndex) {
            this.zIndex = 9;
        }
        this.icon = "";
    }
}
export class Table extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-table");
        this.type = ComponentType.TABLE;
    }
    getIcon(option?: any) {
        if (option <= 2) return "fs-couple-table";
        else return "fs-family-table";
    }
}
export class Door extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-door");
        this.type = ComponentType.DOOR;
        if (!height)
            this.height = 30;
        this.innerHtml = `<div class="barrier left"> </div>
                        <div class="part left"></div>
                        <div class="part right"></div>
                        <div class="barrier right"></div>`;
    }
}
export class WC extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-wc");
        this.type = ComponentType.WC;
    }
}
export class Kitchen extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-kitchen");
        this.type = ComponentType.KITCHEN;
        this.icon = 'fs-kitchen';
    }
}
export class Bar extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-bar");
        this.type = ComponentType.BAR;
        this.icon = 'fs-bar';
    }
}
export class Receptionist extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-receptionist");
        this.type = ComponentType.RECEPTIONIST;
    }
}
export class Stair extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-stair");
        this.type = ComponentType.STAIR; 
    }
}
export class Restrict extends UIComponent {
    constructor(id?: number, title?: string, x?: number, y?: number, width?: number, height?: number, zIndex?: number, rotate?: number) {
        super(id, title, x, y, width, height, zIndex, rotate);
        this.classList.push("ui-restrict");
        this.type = ComponentType.RESTRICT;
        if (!zIndex) {
            this.zIndex = 8;
        }
    }
}
