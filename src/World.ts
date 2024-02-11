import { Block } from "./GameObjects/Block";
import { Collider } from "./Components/Collider";
import { Rigidbody } from "./Components/Rigidbody";
import { GameObject } from "./GameObjects/GameObject";
import { OrthographicCamera, WebGLRenderer } from "three";

export class World {

    static GRAVITY = 9.81;

    public width: number;
    public height: number;

    private _row: Array<Array<Block>>;

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
    }

    public generate(): void {

        for (let y = 0; y < this.height; ++y) {

            const column: Block[] = [];
            for (let x = 0; x < this.width; ++x) {
                let block = new Block(0, "dirt.png");
                block.position.set(x, y, 0);
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

        return this._row[y][x];
    }

    private checkCollision(rigidbody: Rigidbody, direction: string): void {

        const collider = rigidbody.collider;
        const position = rigidbody.collider.gameObject.position;
        const size = rigidbody.collider.size;

        const startX = Math.trunc(position.x - size.x);
        const endX = Math.trunc(position.x + size.x + 1);

        const startY = Math.trunc(position.y - size.y);
        const endY = Math.trunc(position.y + size.y + 1);

        for (let y = startY; y < endY; ++y) {
            if (y >= this.height || y < 0)
                continue;
            for (let x = startX; x < endX; ++x) {

                if (x >= this.width || x < 0)
                    continue;


                const block = this.getBlock(x, y);

                if (!block) continue;
                if (!Collider.checkCollision(collider.gameObject, block)) continue;

                if (direction == "X") {
                    if (rigidbody.velocity.x < 0) {
                        collider.handleCollision({ direction: "left", gameObject: block });

                    }
                    else if (rigidbody.velocity.x > 0) {
                        collider.handleCollision({ direction: "right", gameObject: block });
                    }
                }
                else {

                    if (rigidbody.velocity.y < 0) {
                        collider.handleCollision({ direction: "down", gameObject: block });
                    }

                    if (rigidbody.velocity.y > 0) {
                        collider.handleCollision({ direction: "up", gameObject: block });
                    }


                }
            }
        }
    }

    public render(renderer: WebGLRenderer, fructumSize: number, aspect: number, camera: OrthographicCamera, gameObject: GameObject): void {
        const offsetX = Math.trunc(fructumSize * aspect / 2);
        const offsetY = fructumSize / 2;

        const startX = Math.trunc(gameObject.position.x) - offsetX;
        const endX = Math.trunc(gameObject.position.x) + (offsetX + gameObject.size.x + 1);

        const startY = Math.trunc(gameObject.position.y) - offsetY;
        const endY = Math.trunc(gameObject.position.y) + (offsetY + gameObject.size.y);


        for (let y = startY; y < endY; ++y) {
            if (!this._row[y]) continue;
            for (let x = startX; x < endX; ++x) {
                if (!this._row[y][x]) continue;
                renderer.render(this.getBlock(x, y), camera);
            }
        }
    }

}

