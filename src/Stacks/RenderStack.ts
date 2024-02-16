import { WebGLRenderer } from "three";
import { IRenderable } from "../Interfaces/IRenderable"

export const RenderStack = new class implements IRenderable {
    private _stack: IRenderable[];

    constructor() {
        this._stack = new Array<IRenderable>();
    }

    subscribe(obj: IRenderable): void {
        if (this._stack.includes(obj)) return;
        this._stack.push(obj);
    }

    unsubscribe(obj: IRenderable): void {
        this._stack = this._stack.filter((item) => item !== obj)
    }

    render(renderer: WebGLRenderer): void {
        this._stack.forEach((item) => item.render(renderer));
    }
}