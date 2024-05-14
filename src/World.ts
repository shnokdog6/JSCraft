import { Block } from "./GameObjects/Block";
import { Collider } from "./Components/Collider";
import { Rigidbody } from "./Components/Rigidbody";
import { GameObject } from "./GameObjects/GameObject";
import { WebGLRenderer } from "three";
import { Camera } from "./Tools/Camera";
import { IRenderable } from "./Interfaces/IRenderable";
import { BlockResources } from "./Resources/BlockResources";
import { Mesh } from "./Components/Mesh";

export class World implements IRenderable {
    static GRAVITY = 9.81;

    public width: number;
    public height: number;

    private _row: Array<Array<Block>>;
    private _relativeObject: Mesh;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this._row = new Array<Array<Block>>();
    }

    public addObject(gameObject: GameObject): void {
        const rigidbody: Rigidbody = gameObject.getComponent(Rigidbody);

        if (rigidbody) {
            rigidbody.events.addEventListener(Rigidbody.moveX_Event, () =>
                this.checkCollision(rigidbody, "X"),
            );
            rigidbody.events.addEventListener(Rigidbody.moveY_Event, () =>
                this.checkCollision(rigidbody, "Y"),
            );
        }
    }

    public setRelativeObject(obj: Mesh) {
        this._relativeObject = obj;
    }

    public async generate(): Promise<void> {
        for (let x = 0; x < this.width; ++x) {
            const column: Block[] = [];
            for (let y = 0; y < 10; ++y) {
                let block: Block;
                if (y == 9) block = await BlockResources.GetAsync("grass_side");
                else block = await BlockResources.GetAsync("dirt");

                block.transform.position.set(x, y, 0);
                column.push(block);
            }
            this._row.push(column);
        }
    }

    public getBlock(x: number, y: number): Block {
        if (y >= this.height || y < 0) return;

        if (x >= this.width || x < 0) return;

        return this._row[x][y];
    }

    public destroyBlock(x: number, y: number): void {
        if (y >= this.height || y < 0) return;

        if (x >= this.width || x < 0) return;

        delete this._row[x][y];
    }

    private checkCollision(rigidbody: Rigidbody, direction: string): void {
        const collider = rigidbody.collider;
        const position = rigidbody.transform.position;
        const size = rigidbody.collider.size;

        const startX = Math.trunc(position.x - size.x);
        const endX = Math.trunc(position.x + size.x + 1);

        const startY = Math.trunc(position.y - size.y);
        const endY = Math.trunc(position.y + size.y + 1);

        for (let x = startX; x < endX; ++x) {
            if (x >= this.width || x < 0) continue;

            for (let y = startY; y < endY; ++y) {
                if (y >= this.height || y < 0) continue;

                const block = this.getBlock(x, y);
                if (!block) continue;
                if (!Collider.checkCollision(collider, block.collider))
                    continue;

                if (direction == "X") {
                    if (rigidbody.velocity.x < 0) {
                        collider.handleCollision({
                            direction: "left",
                            collider: block.collider,
                        });
                    } else if (rigidbody.velocity.x > 0) {
                        collider.handleCollision({
                            direction: "right",
                            collider: block.collider,
                        });
                    }
                } else {
                    if (rigidbody.velocity.y < 0) {
                        collider.handleCollision({
                            direction: "down",
                            collider: block.collider,
                        });
                    }

                    if (rigidbody.velocity.y > 0) {
                        collider.handleCollision({
                            direction: "up",
                            collider: block.collider,
                        });
                    }
                }
            }
        }
    }

    public render(renderer: WebGLRenderer): void {
        const offsetX = Math.trunc((Camera.fructumSize * Camera.aspect) / 2);
        const offsetY = Camera.fructumSize / 2;

        const startX =
            Math.trunc(this._relativeObject.transform.position.x) - offsetX;
        const endX =
            Math.trunc(this._relativeObject.transform.position.x) +
            (offsetX + this._relativeObject.size.x + 1);

        const startY =
            Math.trunc(this._relativeObject.transform.position.y) - offsetY;
        const endY =
            Math.trunc(this._relativeObject.transform.position.y) +
            (offsetY + this._relativeObject.size.y);

        for (let x = startX; x < endX; ++x) {
            if (!this._row[x]) continue;
            for (let y = startY; y < endY; ++y) {
                if (!this._row[x][y]) continue;

                const block = this.getBlock(x, y);
                block.mesh.render(renderer);
            }
        }
    }
}
