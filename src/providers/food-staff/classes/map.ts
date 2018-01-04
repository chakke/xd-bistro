import { UIComponent } from "./ui-component";
import { ComponentFactory } from "../factories/component-factory";
export class Map {
    public id: string;
    public floorId: string;
    public title: string;
    components: Array<UIComponent> = [];
    public realWidth: number = 0;
    public realHeight: number = 0;
    public componentFactory: ComponentFactory;
    public numberOfElement: any = {};
    public currentWidth: number = 0;
    public currentHeight: number = 0;

    constructor(id: string, floorId: string, title: string, components: Array<UIComponent>, numberOfElement?: number, realWidth?: number, realHeight?: number, currentWidth?: number, currentHeight?: number) {
        this.id = id;
        this.floorId = floorId;
        this.title = title;
        this.numberOfElement = (numberOfElement ? numberOfElement : {});
        this.components = components ? components : [];
        this.componentFactory = new ComponentFactory();
        this.realWidth = realWidth ? realWidth : 0;
        this.realHeight = realHeight ? realHeight : 0;
        this.currentWidth = currentWidth ? currentWidth : 0;
        this.currentHeight = currentHeight ? currentHeight : 0;
    }

    mappingFirebaseData(mapData) {
        if (mapData) {
            this.id = mapData.id,
                this.floorId = mapData.floor_id;
            this.title = mapData.title;
            this.realWidth = mapData.width;
            this.realHeight = mapData.height;
        }
    }

    addComponent(type: string, title?: string, x?: number, y?: number, width?: number, height?: number) {
        
        if (this.numberOfElement[type]) {
            this.numberOfElement[type] += 1;
        } else {
            this.numberOfElement[type] = 1;
        }
        let component = this.componentFactory.getComponent(this.numberOfElement[type], type, title, x, y, width, height);
        if (title === null || title === undefined) {
            component.title = component.type.name + " " + this.numberOfElement[type];
        }

        this.components.push(component);
    }

    getId() {
        return this.id;
    }

    getNumberOfElement() {
        return this.numberOfElement;
    }

    setWidth(width: number) {
        this.currentWidth = width;
    }

    setHeight(height: number) {
        this.currentHeight = height;
    }

    getWidth() {
        return this.currentWidth;
    }

    getHeight() {
        return this.currentHeight;
    }
}