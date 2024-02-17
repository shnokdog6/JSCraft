import { Mesh as ThreeMash, Material, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";
import { GameObject } from "../GameObjects/GameObject";
import { Component } from "./Component";
import { IRenderable } from "../Interfaces/IRenderable";
import { Camera } from "../Tools/Camera";
import { RenderStack } from "../Stacks/RenderStack";

export interface MeshOptions {
    geometry: PlaneGeometry,
    material?: Material,
    subscribeToRenderStack?: boolean
}

export class Mesh extends Component implements IRenderable {

    private _mesh: ThreeMash;
    private _size: Vector3;

    public get size() {
        if (!this._size) {

            if (!this._mesh.geometry.boundingBox) {
                this._mesh.geometry.computeBoundingBox();
            }
            const temp: Vector3 = new Vector3();
            this._mesh.geometry.boundingBox.getSize(temp);

            this._size = new Vector3(temp.x, temp.y, temp.z);
        }

        return this._size;
    }

    public get material() {
        return this._mesh.material;
    }

    constructor(gameObject: GameObject, options: () => MeshOptions) {
        super(gameObject);

        const {
            geometry,
            material = new MeshBasicMaterial(),
            subscribeToRenderStack = true
        } = options();

        this._mesh = new ThreeMash(geometry, material);

        if (subscribeToRenderStack) {
            RenderStack.subscribe(this);
        }
    }

    init() {
        super.init();

        this._mesh.position.copy(this.transform.position)
        this._mesh.rotation.copy(this.transform.rotation);
        this.transform.bind(this._mesh.position, this._mesh.rotation);

    }

    public render(renderer: THREE.WebGLRenderer): void {
        renderer.render(this._mesh, Camera);
    }


}