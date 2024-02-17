import { Block } from "./GameObjects/Block";
import { Collider } from "./Components/Collider";
import { Rigidbody } from "./Components/Rigidbody";
import { GameObject } from "./GameObjects/GameObject";
import { WebGLRenderer } from "three";
import { Camera } from "./Tools/Camera";
import { IRenderable, isRenderable } from "./Interfaces/IRenderable";
import { isUpdatable } from "./Interfaces/IUpdatable";
import { UpdateStack } from "./Stacks/UpdateStack";
import { RenderStack } from "./Stacks/RenderStack";
import Noise from "./Noise/noise";
import { BlockResources } from "./Resources/BlockResources";
import { randomInteger } from "./Tools/Random";
import { Mesh } from "./Components/Mesh";

export class World implements IRenderable {

    static GRAVITY = 9.81;

    public width: number;
    public height: number;

    private _row: Array<Array<Block>>;
    private _relativeObject: Mesh;

    private flatness: Array<number> = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this._row = new Array<Array<Block>>;
    }



    public addObject(gameObject: GameObject): void {

        const rigidbody: Rigidbody = gameObject.getComponent(Rigidbody) as Rigidbody;

        if (rigidbody) {
            rigidbody.events.addEventListener(Rigidbody.moveX_Event, () => this.checkCollision(rigidbody, "X"));
            rigidbody.events.addEventListener(Rigidbody.moveY_Event, () => this.checkCollision(rigidbody, "Y"));
        }

        if (isUpdatable(gameObject)) {
            UpdateStack.subscribe(gameObject);
        }

        if (isRenderable(gameObject)) {
            RenderStack.subscribe(gameObject);
        }
    }

    public setRelativeObject(obj: Mesh) {
        this._relativeObject = obj;
    }

    public async generate(): Promise<void> {

        const noise: Noise = new Noise();
        noise.seed(Math.random());


        for (let x = 0; x < this.width; ++x) {

            const column: Block[] = [];
            for (let y = 0; y < 10; ++y) {
                let block: Block;
                if (y == 9)
                    block = await BlockResources.GetAsync("grass_side");
                else
                    block = await BlockResources.GetAsync("dirt");

                block.transform.position.set(x, y, 0);
                column.push(block);
            }
            this._row.push(column);

        }


    }

    public getBlock(x: number, y: number): Block {
        if (y >= this.height || y < 0)
            return;

        if (x >= this.width || x < 0)
            return;

        return this._row[x][y];
    }

    public destroyBlock(x: number, y: number): void {
        if (y >= this.height || y < 0)
            return;

        if (x >= this.width || x < 0)
            return;

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

            if (x >= this.width || x < 0)
                continue;

            for (let y = startY; y < endY; ++y) {
                if (y >= this.height || y < 0)
                    continue;

                const block = this.getBlock(x, y);
                if (!block) continue;
                if (!Collider.checkCollision(collider, block.collider)) continue;

                if (direction == "X") {
                    if (rigidbody.velocity.x < 0) {
                        collider.handleCollision({ direction: "left", gameObject: block.collider });

                    }
                    else if (rigidbody.velocity.x > 0) {
                        collider.handleCollision({ direction: "right", gameObject: block.collider });
                    }
                }
                else {

                    if (rigidbody.velocity.y < 0) {
                        collider.handleCollision({ direction: "down", gameObject: block.collider });
                    }

                    if (rigidbody.velocity.y > 0) {
                        collider.handleCollision({ direction: "up", gameObject: block.collider });
                    }
                }
            }
        }
    }

    public render(renderer: WebGLRenderer): void {
        const offsetX = Math.trunc(Camera.fructumSize * Camera.aspect / 2);
        const offsetY = Camera.fructumSize / 2;

        const startX = Math.trunc(this._relativeObject.transform.position.x) - offsetX;
        const endX = Math.trunc(this._relativeObject.transform.position.x) + (offsetX + this._relativeObject.size.x + 1);

        const startY = Math.trunc(this._relativeObject.transform.position.y) - offsetY;
        const endY = Math.trunc(this._relativeObject.transform.position.y) + (offsetY + this._relativeObject.size.y);

        for (let x = startX; x < endX; ++x) {
            if (!this._row[x]) continue;
            for (let y = startY; y < endY; ++y) {
                if (!this._row[x][y]) continue;
                this.getBlock(x, y).mesh.render(renderer);
            }

        }


    }

}

