import { EventDispatcher, Vector3 } from "three";
import { Component } from "./Component";
import { GameObject } from "../GameObjects/GameObject";

export interface ColliderOptions {
    size?: Vector3
}

export class Collider extends Component {

    static collisionEvent: string = "collision";

    public size: Vector3;
    public events: EventDispatcher<any>;

    constructor(gameObject: GameObject, options?: () => ColliderOptions) {
        super(gameObject);

        const parameters: ColliderOptions = options ? options() : { size: new Vector3(1, 1, 0) };

        this.size = parameters.size;
        this.events = new EventDispatcher<any>();
    }

    public handleCollision(collision): void {

        const intersectObject = collision.gameObject;

        const width = (this.size.x + collision.gameObject.size.x) / 2;
        const height = (this.size.y + collision.gameObject.size.y) / 2;

        if (collision.direction == "left") {
            this.transform.position.x = intersectObject.transform.position.x + width;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "right") {
            this.transform.position.x = intersectObject.transform.position.x - width;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "down") {
            this.transform.position.y = intersectObject.transform.position.y + height;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "up") {
            this.transform.position.y = intersectObject.transform.position.y - height;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
    }

    public static checkCollision(collider1: Collider, collider2: Collider): boolean {
        const width = (collider1.size.x + collider2.size.x) / 2;
        const height = (collider1.size.y + collider2.size.y) / 2;

        if (collider1.transform.position.x < collider2.transform.position.x + width &&
            collider1.transform.position.x + width > collider2.transform.position.x &&
            collider1.transform.position.y < collider2.transform.position.y + height &&
            collider1.transform.position.y + height > collider2.transform.position.y) {
            return true;
        }
        return false;
    }
}