import { UIComponent } from "./ui-component";
import { ComponentFactory } from "../factories/component-factory";
export class Map {
    public id: number;
    public floorId: number;
    public title: string;
    components: Array<UIComponent> = [];
    public componentFactory: ComponentFactory;
    public numberOfElement: any = {};
    public currentWidth: number = 0;
    public currentHeight: number = 0;

    constructor(id: number, floorId: number, title: string, components: Array<UIComponent>, numberOfElement?: number, currentWidth?: number, currentHeight?: number) {
        this.id = id;
        this.floorId = floorId;
        this.title = title;
        this.numberOfElement = (numberOfElement ? numberOfElement : {});
        this.currentWidth = (currentWidth ? currentWidth : 0);
        this.currentHeight = (currentHeight ? currentHeight : 0);
        this.components = components ? components : [];
        this.componentFactory = new ComponentFactory();
    }

    addComponent(type: string, title?: string, x?: number, y?: number, width?: number, height?: number) {
        let component = this.componentFactory.getComponent(0, type, title, x, y, width, height);
        if (this.numberOfElement[type]) {
            this.numberOfElement[type] += 1;
        } else {
            this.numberOfElement[type] = 1;
        }

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