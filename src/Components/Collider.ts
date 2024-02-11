import { EventDispatcher } from "three";
import { Component } from "./Component";
import { GameObject } from "../GameObjects/GameObject";

export class Collider extends Component {

    static collisionEvent: string = "collision";

    public size : {width: number, height: number};
    public events: EventDispatcher<any>;

    constructor(gameObject: GameObject, size: {width: number, height: number} = gameObject.size) {
        super(gameObject);

        this.size = size;
        this.events = new EventDispatcher<any>();
    }

    public update() : void{
        return;
    }

    public handleCollision(collision) : void {
        const width = (this.gameObject.size.width + collision.gameObject.size.width) / 2;
        const height = (this.gameObject.size.height + collision.gameObject.size.height) / 2;

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
        const height = (gameObject1.size.height + gameObject2.size.height) / 2;
        const width = (gameObject1.size.width + gameObject2.size.width) / 2;

        if (gameObject1.position.x < gameObject2.position.x + width &&
            gameObject1.position.x + width > gameObject2.position.x &&
            gameObject1.position.y < gameObject2.position.y + height &&
            gameObject1.position.y + height > gameObject2.position.y) {
            return true;
        }
        return false;
    }
}