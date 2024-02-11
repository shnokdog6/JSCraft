import { Component } from "../Components/Component";
import { BufferGeometry, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three";

export class GameObject extends Mesh {

    private _size: Vector2; 
    private _components: Map<string, Component>;


    public get size() : Vector2 {

        if (!this._size){

            if (!this.geometry.boundingBox){
                this.geometry.computeBoundingBox();
            }
            const temp : Vector3 = new Vector3();
            this.geometry.boundingBox.getSize(temp);
            
            this._size = new Vector2(temp.x, temp.y);
        }

        return this._size;
    }

    constructor(geometry: BufferGeometry, material : MeshBasicMaterial) {
        super(geometry, material);

        this._components = new Map<string, Component>();
    }

    update(): void {
        this._components.forEach((component) => component.update());
    }

    addComponent(componentConstructor: new(...args: any) => Component, ...parameters: any) : Component {

        if (!(componentConstructor.prototype instanceof Component))
            throw new Error("Argument was not a component");

        const componentInstance = new componentConstructor(this, ...parameters);
        this._components.set(componentInstance.name, componentInstance);
        return componentInstance;

    }

    getComponent(componentConstructor: new(...args: any) => Component) : Component {
        let component = this._components.get(componentConstructor.name);
        if (!component)
            throw new Error(`${componentConstructor} Component was not found`);

        return component;
    }
}