import { GameObject } from "../GameObjects/GameObject";
import { IInitializable } from "../Interfaces/IInitializable";
import { InitStack } from "../Stacks/InitStack";
import { Transform } from "./Transform";

export abstract class Component implements IInitializable {

    public name: string;
    private _transform: Transform;

    public get transform() {
        return this._transform;
    }

    constructor(public gameObject: GameObject) {
        this.name = this.constructor.name;

        InitStack.subscribe(this);
    }

    init(): void {
        this._transform = this.gameObject.transform;
    }

}