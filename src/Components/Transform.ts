import {Euler, EventDispatcher, Vector3} from "three";
import {Component} from "./Component";
import {GameObject} from "../GameObjects/GameObject";

export interface TransformOptions {
    position?: Vector3
}

export class Transform extends Component {

    private _position: Vector3;
    private _rotation: Euler;

    public get position() {
        return this._position;
    }

    public get rotation() {
        return this._rotation;
    }

    constructor(gameObject: GameObject, options?: () => TransformOptions) {
        super(gameObject);

        const parameters: TransformOptions = options ?
            options()
            :
            {position: new Vector3(0, 0, 0)};

        this._position = parameters.position;
        this._rotation = new Euler(0, 0, 0);
    }

    public bind(position: Vector3, rotation: Euler) {
        this._position = position;
        this._rotation = rotation;
    }

}