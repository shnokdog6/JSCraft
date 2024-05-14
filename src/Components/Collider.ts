import { EventDispatcher, Vector3 } from "three";
import { Component } from "./Component";
import { GameObject } from "../GameObjects/GameObject";

export interface ColliderOptions {
    size?: Vector3;
}

interface ColliderEvent {
    Collision: { collision: Collision };
}

export interface Collision {
    direction: "left" | "right" | "up" | "down";
    collider: Collider;
}

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

        if (collision.direction == "left") {
            this.transform.position.x =
                intersectObject.transform.position.x + width;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == "right") {
            this.transform.position.x =
                intersectObject.transform.position.x - width;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == "down") {
            this.transform.position.y =
                intersectObject.transform.position.y + height;
            this.events.dispatchEvent({
                type: "Collision",
                collision,
            });
        }
        if (collision.direction == "up") {
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
