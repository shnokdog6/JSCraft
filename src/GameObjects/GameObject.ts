import { Component } from "../Components/Component";
import { isUpdatable, IUpdatable } from "../Interfaces/IUpdatable";
import { Transform } from "../Components/Transform";
import { IInitializable, isInitializable } from "../Interfaces/IInitializable";
import { InitStack } from "../Stacks/InitStack";
import { UpdateStack } from "../Stacks/UpdateStack";

export class GameObject implements IInitializable, IUpdatable {
    private readonly _transform: Transform;
    private _components: Map<string, Component>;

    public get transform() {
        return this._transform;
    }

    constructor() {
        this._components = new Map<string, Component>();
        this._transform = new Transform(this);

        InitStack.subscribe(this);
        UpdateStack.subscribe(this);
    }

    public init(): void {
        this._components.forEach((component) => {
            if (isInitializable(component)) {
                component.init();
            }
        });
    }

    public update(): void {
        this._components.forEach((component) => {
            if (isUpdatable(component)) {
                component.update();
            }
        });
    }

    public addComponent<T extends Component>(
        componentConstructor: new (...args: any) => T,
        ...parameters: any
    ): T {
        if (!(componentConstructor.prototype instanceof Component))
            throw new Error("Argument was not a component");

        const componentInstance = new componentConstructor(this, ...parameters);
        this._components.set(componentInstance.name, componentInstance);
        return componentInstance;
    }

    public getComponent<T extends Component>(
        componentConstructor: new (...args: any) => T,
    ): T {
        let component = this._components.get(componentConstructor.name) as T;

        if (!component)
            throw new Error(
                `${componentConstructor.name} component was not found`,
            );

        return component;
    }
}
