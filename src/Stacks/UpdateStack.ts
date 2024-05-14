import { IUpdatable } from "../Interfaces/IUpdatable";
import { Time } from "../Tools/Timer";

export const UpdateStack = new (class implements IUpdatable {
    private _stack: IUpdatable[];

    constructor() {
        this._stack = new Array<IUpdatable>();
        this._stack.push(Time);
    }

    subscribe(obj: IUpdatable): void {
        if (this._stack.includes(obj)) return;
        this._stack.push(obj);
    }

    unsubscribe(obj: IUpdatable): void {
        this._stack = this._stack.filter((item) => item !== obj);
    }

    update(): void {
        this._stack.forEach((item) => item.update());
    }
})();
