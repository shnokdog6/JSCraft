import { GameObject } from "../GameObjects/GameObject";

export abstract class Component {

    public name : string;

    constructor(public gameObject: GameObject) {
        this.name = this.constructor.name;
    }

}