import { Component } from "../Components/Component";
import { BufferGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";

export class GameObject extends Mesh {

    private _components: Map<string, Component>;

    public get size() : {width: number, height: number} {
        if (!this.geometry.boundingBox){
            this.geometry.computeBoundingBox();
        }

        const size : Vector3 = new Vector3();
        this.geometry.boundingBox.getSize(size);

        return {width: size.x, height: size.y};
    }

    constructor(geometry: BufferGeometry, material : MeshBasicMaterial) {
        super(geometry, material);

        this._components = new Map<string, Component>();
    }

    Update(): void {
        this._components.forEach((component) => component.update());
    }

    AddComponent(componentConstructor, ...parameters) : Component {

        if (!(componentConstructor.prototype instanceof Component))
            throw new Error("Argument was not a component");

        const componentInstance = new componentConstructor(this, ...parameters);
        this._components.set(componentInstance.name, componentInstance);
        return componentInstance;

    }

    GetComponent(componentConstructor) : Component {
        let component = this._components.get(componentConstructor.name);
        if (!component)
            throw new Error(`${componentConstructor} Component was not found`);

        return component;
    }
}