import { IInitializable } from "../Interfaces/IInitializable";
import { Time } from "../Tools/Timer";

export const InitStack = new class {
    private _stack: IInitializable[];

    constructor() {
        this._stack = new Array<IInitializable>();
        this._stack.push(Time);
    }

    subscribe(obj: IInitializable): void {
        if (this._stack.includes(obj)) return;
        this._stack.push(obj);
    }

    init(): void {
        this._stack.forEach((item) => item.init());
    }
} 