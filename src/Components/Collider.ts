import { EventDispatcher, Vector2 } from "three";
import { Component } from "./Component";
import { GameObject } from "../GameObjects/GameObject";

export class Collider extends Component {

    static collisionEvent: string = "collision";

    public size : Vector2;
    public events: EventDispatcher<any>;

    constructor(gameObject: GameObject, size: Vector2 = gameObject.size) {
        super(gameObject);

        this.size = size;
        this.events = new EventDispatcher<any>();
    }

    public update() : void{
        return;
    }

    public handleCollision(collision) : void {
        const width = (this.gameObject.size.x + collision.gameObject.size.x) / 2;
        const height = (this.gameObject.size.y + collision.gameObject.size.y) / 2;

        if (collision.direction == "left") {
            this.gameObject.position.x = collision.gameObject.position.x + width;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "right") {
            this.gameObject.position.x = collision.gameObject.position.x - width;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "down") {
            this.gameObject.position.y = collision.gameObject.position.y + height;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
        if (collision.direction == "up") {
            this.gameObject.position.y = collision.gameObject.position.y - height;
            this.events.dispatchEvent({
                type: Collider.collisionEvent,
                collision
            });
        }
    }

    public static checkCollision(gameObject1: GameObject, gameObject2: GameObject) : boolean {
        const height = (gameObject1.size.y + gameObject2.size.y) / 2;
        const width = (gameObject1.size.x + gameObject2.size.x) / 2;

        if (gameObject1.position.x < gameObject2.position.x + width &&
            gameObject1.position.x + width > gameObject2.position.x &&
            gameObject1.position.y < gameObject2.position.y + height &&
            gameObject1.position.y + height > gameObject2.position.y) {
            return true;
        }
        return false;
    }
}