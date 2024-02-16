import { MeshBasicMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace, Texture, Vector3, WebGLRenderer } from "three";
import { GameObject } from "../GameObject";
import { TextureResources } from "../../Resources/TextureResources";
import { Camera } from "../../Tools/Camera";
import { RenderStack } from "../../Stacks/RenderStack";
import { IRenderable } from "../../Interfaces/IRenderable";
import { IUpdatable } from "../../Interfaces/IUpdatable";
import { UpdateStack } from "../../Stacks/UpdateStack";

export class Crosshair extends GameObject implements IRenderable, IUpdatable {

    private _parent: GameObject;
    private _diffence: Vector3;

    constructor(parent: GameObject) {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshBasicMaterial({ transparent: true });

        super(geometry, material);

        this._parent = parent;
        this._diffence = new Vector3(0, 0, 0);

        this.initTexture();


        RenderStack.subscribe(this);
        UpdateStack.subscribe(this);

        window.addEventListener("mousemove", (event) => this.onMouseMove(event));

    }

    public update(): void {
        super.update();


        const diffirenceX = this._parent.position.x - this.position.x;
        if (Math.ceil(diffirenceX) - this._diffence.x > 1) {
            this.position.x += 1;
            this._diffence.x = this._parent.position.x - this.position.x;
        }
        else if (Math.floor(diffirenceX) - this._diffence.x < -1) {
            this.position.x -= 1;
            this._diffence.x = this._parent.position.x - this.position.x;
        }


        const diffirenceY = this._parent.position.y - this.position.y;
        if (Math.ceil(diffirenceY) - this._diffence.y > 1) {
            this.position.y += 1;
            this._diffence.y = this._parent.position.y - this.position.y;
        }
        else if (Math.floor(diffirenceY) - this._diffence.y < -1) {
            this.position.y -= 1;
            this._diffence.y = this._parent.position.y - this.position.y;
        }



    }

    public render(renderer: WebGLRenderer): void {
        renderer.render(this, Camera);
    }

    private initTexture(): void {
        const texture: Texture = TextureResources.Get("cursor.png");

        texture.colorSpace = SRGBColorSpace;
        texture.magFilter = NearestFilter;

        const material = (this.material as MeshBasicMaterial);
        material.map = texture;
        material.needsUpdate = true;

    }

    private onMouseMove(event: MouseEvent): void {
        const newPosition: Vector3 = Camera.TransformToWorldCoordinate(new Vector3(event.clientX, event.clientY, 0));
        this.position.set(Math.round(newPosition.x), Math.round(newPosition.y), 0);
        this._diffence.set(this._parent.position.x - this.position.x, this._parent.position.y - this.position.y, 0);
    }
}