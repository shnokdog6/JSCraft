import { Component } from "../Components/Component";
import { BufferGeometry, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three";
import { isUpdatable } from "../Interfaces/IUpdatable";
import { Transform } from "../Components/Transform";

export class GameObject {

    private _transform: Transform;
    private _components: Map<string, Component>;

    public get transform() {
        return this._transform;
    }

    constructor() {
        this._components = new Map<string, Component>();
        this._transform = new Transform(this);
    }

    update(): void {
        this._components.forEach((component) => {
            if (isUpdatable(component)) {
                component.update();
            }
        });
    }

    addComponent(componentConstructor: new (...args: any) => Component, ...parameters: any): Component {

        if (!(componentConstructor.prototype instanceof Component))
            throw new Error("Argument was not a component");

        const componentInstance = new componentConstructor(this, ...parameters);
        this._components.set(componentInstance.name, componentInstance);
        return componentInstance;

    }

    getComponent(componentConstructor: new (...args: any) => Component): Component {
        let component = this._components.get(componentConstructor.name);
        if (!component)
            throw new Error(`${componentConstructor.name} component was not found`);

        return component;
    }
}