import { GameObject } from "../GameObjects/GameObject";
import { IInitializable } from "../Interfaces/IInitializable";
import { InitStack } from "../Stacks/InitStack";
import { Transform } from "./Transform";

export abstract class Component {

    public readonly name: string;
    private readonly _gameObject: GameObject

    public get transform() {
        return this._gameObject.transform;
    }

    public get gameObject(){
        return this._gameObject;
    }

    protected constructor(gameObject: GameObject) {
        this.name = this.constructor.name;
        this._gameObject = gameObject;
    }

    public addComponent<T extends Component>(componentConstructor: new (...args: any) => T, ...parameters: any): T {
        return this.gameObject.addComponent(componentConstructor, parameters);
    }

    public getComponent<T extends Component>(componentConstructor: new (...args: any) => T): T {
        return this.gameObject.getComponent(componentConstructor);
    }

}