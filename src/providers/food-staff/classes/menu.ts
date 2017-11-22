export class Menu {
    private _id: number;
    private _name: string;
    private _active: boolean;
    private _icon: string;
    private _page: string;
    private _link: string;

    constructor(id: number, name: string, icon?: string, active?: boolean, page?: string, link?: string) {
        this._id = id;
        this._name = name;
        this._active = (active ? active : false);
        this._icon = (icon ? icon : "");
        this._page = (page ? page : "");
        this._link = (link ? link : "");
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get active(): boolean {
        return this._active;
    }

    public set active(value: boolean) {
        this._active = value;
    }

    public get icon(): string {
        return this._icon;
    }

    public set icon(value: string) {
        this._icon = value;
    }

    public get page(): string {
        return this._page;
    }

    public set page(value: string) {
        this._page = value;
    }

    public get link(): string {
        return this._link;
    }

    public set link(value: string) {
        this._link = value;
    }



}