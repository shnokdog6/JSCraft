import { IInitializable } from "../Interfaces/IInitializable";
import { IUpdatable } from "../Interfaces/IUpdatable";

export const Time = new class implements IUpdatable, IInitializable {

    private _currentTime: number = 0;
    private _prevTime: number = 0;
    private _deltaTime: number = 0;

    get deltaTime() {
        return this._deltaTime;
    }

    init() {
        this._prevTime = performance.now();
    }

    update() {
        this._currentTime = performance.now();
        this._deltaTime = (this._currentTime - this._prevTime) / 1000;
        this._prevTime = this._currentTime;
    }
}