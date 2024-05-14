import { EventDispatcher, Vector3 } from "three";
import { Component } from "./Component";
import { GameObject } from "../GameObjects/GameObject";

export interface ColliderOptions {
    size?: Vector3;
}

interface ColliderEvent {
    Collision: { collision: Collision };
}

export enum Direction {
    LEFT,
    RIGHT,
    UP,
    DOWN
}

export interface Collision {
    direction: Direction;
    collider: Collider;
}

export type CollisionEvent = ColliderEvent["Collision"];

export class Collider extends Component {
    public size: Vector3;
    public events: EventDispatcher<ColliderEvent>;

    constructor(gameObject: GameObject, options: () => ColliderOptions) {
        super(gameObject);

        const parameters: ColliderOptions = options
            ? options()
            : { size: new Vector3(1, 1, 0) };

        this.size = parameters.size;
        this.events = new EventDispatcher<ColliderEvent>();
    }

    public handleCollision(collision: Collision): void {
        const intersectObject = collision.collider;

        const width = (this.size.x + collision.collider.size.x) / 2;
        const height = (this.size.y + collision.collider.size.y) / 2;

        if (collision.direction == Direction.LEFT) {
            this.transform.position.x =
                intersectObject.transform.position.x + width;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == Direction.RIGHT) {
            this.transform.position.x =
                intersectObject.transform.position.x - width;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == Direction.DOWN) {
            this.transform.position.y =
                intersectObject.transform.position.y + height;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == Direction.UP) {
            this.transform.position.y =
                intersectObject.transform.position.y - height;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
    }

    public static checkCollision(
        collider1: Collider,
        collider2: Collider,
    ): boolean {
        const width = (collider1.size.x + collider2.size.x) / 2;
        const height = (collider1.size.y + collider2.size.y) / 2;

        if (
            collider1.transform.position.x <
                collider2.transform.position.x + width &&
            collider1.transform.position.x + width >
                collider2.transform.position.x &&
            collider1.transform.position.y <
                collider2.transform.position.y + height &&
            collider1.transform.position.y + height >
                collider2.transform.position.y
        ) {
            return true;
        }
        return false;
    }
}
