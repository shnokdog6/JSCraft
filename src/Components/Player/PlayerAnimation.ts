import {
    MeshBasicMaterial,
    NearestFilter,
    SRGBColorSpace,
    Texture,
} from "three";
import { InputReader } from "../../Input/InputReader";
import { TextureResources } from "../../Resources/TextureResources";
import { Component } from "../Component";
import { GameObject } from "../../GameObjects/GameObject";
import { IUpdatable } from "../../Interfaces/IUpdatable";
import { Mesh } from "../Mesh";

export class PlayerAnimation extends Component implements IUpdatable {
    public material: MeshBasicMaterial;
    public frameCount: number;
    public currentFrame: number;
    public prevTime: number;
    public isMoving: number;
    public spriteAtlas: Texture;

    constructor(gameObject: GameObject) {
        super(gameObject);

        this.material = gameObject.getComponent(Mesh)
            .material as MeshBasicMaterial;
        this.frameCount = 17;
        this.currentFrame = 0;
        this.prevTime = 0;
        this.isMoving = 0;

        this.initSpriteAtlas();

        InputReader.events.addEventListener("Move", (event) =>
            this.OnMove(event),
        );
    }

    public update(): void {
        if (!this.isMoving) return;

        let now = performance.now();
        if (now - this.prevTime >= 100) {
            this.PlayNextFrame();
            this.prevTime = now;
        }
    }

    private initSpriteAtlas(): void {
        this.spriteAtlas = TextureResources.Get("Steve_Mojang.png");
        this.spriteAtlas.repeat.set(1 / 17, 1);

        this.material.map = this.spriteAtlas;
        this.material.needsUpdate = true;
    }

    private OnMove(event): void {
        this.isMoving = event.direction;
        if (!this.isMoving) {
            this.PlayFrame(0);
            this.prevTime = 0;
        }
    }

    private PlayNextFrame(): void {
        if (this.currentFrame > 4) this.currentFrame = 0;
        this.PlayFrame(++this.currentFrame);
    }

    private PlayFrame(number): void {
        this.spriteAtlas.offset.x =
            (number % this.frameCount) / this.frameCount;
    }
}
