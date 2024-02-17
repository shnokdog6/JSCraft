import { MeshBasicMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace, Texture, Vector3, WebGLRenderer } from "three";
import { GameObject } from "../GameObject";
import { TextureResources } from "../../Resources/TextureResources";
import { Camera } from "../../Tools/Camera";
import { IUpdatable } from "../../Interfaces/IUpdatable";
import { UpdateStack } from "../../Stacks/UpdateStack";
import { Mesh, MeshOptions } from "../../Components/Mesh";
import { Transform } from "../../Components/Transform";

export class Crosshair extends GameObject implements IUpdatable {

    private mesh: Mesh;
    private _mousePosition: Vector3 = new Vector3(0, 0, 0);

    constructor() {

        super();

        this.mesh = this.addComponent(Mesh, (): MeshOptions => {
            return {
                geometry: new PlaneGeometry(1, 1),
                material: new MeshBasicMaterial({ transparent: true })
            }
        }) as Mesh;

        this.initTexture();
        window.addEventListener("mousemove", (event) => this.onMouseMove(event));

        UpdateStack.subscribe(this);
    }


    update(): void {
        const _newPosition: Vector3 = Camera.TransformToWorldCoordinate(this._mousePosition);
        this.transform.position.set(Math.round(_newPosition.x), Math.round(_newPosition.y), 0);
    }


    private initTexture(): void {
        const texture: Texture = TextureResources.Get("cursor.png");

        texture.colorSpace = SRGBColorSpace;
        texture.magFilter = NearestFilter;

        const material = (this.mesh.material as MeshBasicMaterial);
        material.map = texture;
        material.needsUpdate = true;

    }

    private onMouseMove(event: MouseEvent): void {
        this._mousePosition.set(event.clientX, event.clientY, 0);
    }
}